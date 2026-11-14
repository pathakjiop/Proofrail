use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use std::sync::Arc;
use uuid::Uuid;
use vulnledger_domain::*;
use vulnledger_infrastructure::{
    parsers::{cyclonedx, scanner, spdx},
    AppStateStore, EvidencePackager, StorageService,
};
use vulnledger_shared::{compute_sha256, new_id, now_utc, AppError, Result};

#[derive(Clone)]
pub struct AppServices {
    pub store: AppStateStore,
    pub storage: Arc<dyn StorageService>,
}

impl AppServices {
    pub fn new(store: AppStateStore, storage: Arc<dyn StorageService>) -> Self {
        Self { store, storage }
    }

    // --- Authentication & User Management ---
    pub async fn register_user(
        &self,
        email: &str,
        name: &str,
        password: &str,
        org_name: &str,
    ) -> Result<(User, Organization)> {
        if email.trim().is_empty() || password.len() < 8 {
            return Err(AppError::Validation("Password must be at least 8 characters".into()));
        }

        let salt = SaltString::generate(&mut OsRng);
        let argon2 = Argon2::default();
        let password_hash = argon2
            .hash_password(password.as_bytes(), &salt)
            .map_err(|e| AppError::Internal(format!("Password hashing error: {}", e)))?
            .to_string();

        let user = User {
            id: new_id(),
            email: email.trim().to_lowercase(),
            name: name.trim().to_string(),
            password_hash,
            created_at: now_utc(),
            updated_at: now_utc(),
        };

        let created_user = self.store.create_user(user).await?;

        let slug = org_name.to_lowercase().replace(' ', "-");
        let org = Organization {
            id: new_id(),
            name: org_name.to_string(),
            slug,
            created_at: now_utc(),
        };

        let created_org = self.store.create_organization(org, created_user.id).await?;

        Ok((created_user, created_org))
    }

    pub async fn login_user(&self, email: &str, password: &str) -> Result<User> {
        let user = self
            .store
            .get_user_by_email(&email.trim().to_lowercase())
            .await
            .ok_or_else(|| AppError::Unauthorized("Invalid credentials".into()))?;

        let parsed_hash = PasswordHash::new(&user.password_hash)
            .map_err(|e| AppError::Internal(format!("Invalid stored hash: {}", e)))?;

        Argon2::default()
            .verify_password(password.as_bytes(), &parsed_hash)
            .map_err(|_| AppError::Unauthorized("Invalid credentials".into()))?;

        Ok(user)
    }

    // --- Project Service ---
    pub async fn create_project(
        &self,
        org_id: Uuid,
        name: &str,
        description: Option<String>,
        repository_url: Option<String>,
        default_branch: Option<String>,
        product_identifier: &str,
    ) -> Result<Project> {
        if name.trim().is_empty() {
            return Err(AppError::Validation("Project name cannot be empty".into()));
        }

        let project = Project {
            id: new_id(),
            organization_id: org_id,
            name: name.trim().to_string(),
            description,
            repository_url,
            default_branch: default_branch.unwrap_or_else(|| "main".to_string()),
            product_identifier: product_identifier.trim().to_string(),
            created_at: now_utc(),
            updated_at: now_utc(),
        };

        self.store.create_project(project).await
    }

    pub async fn create_release(
        &self,
        project_id: Uuid,
        version: &str,
        commit_sha: Option<String>,
    ) -> Result<Release> {
        let release = Release {
            id: new_id(),
            project_id,
            version: version.trim().to_string(),
            commit_sha,
            released_at: now_utc(),
            created_at: now_utc(),
        };

        self.store.create_release(release).await
    }

    // --- SBOM Service ---
    pub async fn ingest_sbom(
        &self,
        org_id: Uuid,
        project_id: Uuid,
        release_id: Option<Uuid>,
        content: &[u8],
    ) -> Result<(SbomDocument, usize)> {
        let json_str = std::str::from_utf8(content)
            .map_err(|_| AppError::Validation("Uploaded SBOM must be valid UTF-8".into()))?;

        let sbom_id = new_id();
        let sha256_hash = compute_sha256(content);

        // Try CycloneDX first, then SPDX
        let (format, parsed_data) = if let Ok(data) = cyclonedx::parse_cyclonedx_json(sbom_id, json_str) {
            (SbomFormat::CycloneDxJson, data)
        } else if let Ok(data) = spdx::parse_spdx_json(sbom_id, json_str) {
            (SbomFormat::SpdxJson, data)
        } else {
            return Err(AppError::ParseError("Unsupported or invalid SBOM format. VulnLedger supports CycloneDX JSON and SPDX JSON.".into()));
        };

        let component_count = parsed_data.components.len();

        let doc = SbomDocument {
            id: sbom_id,
            organization_id: org_id,
            project_id,
            release_id,
            format,
            spec_version: parsed_data.spec_version,
            component_count,
            sha256_hash,
            file_size_bytes: content.len(),
            created_at: now_utc(),
        };

        // Save raw artifact to storage
        let storage_key = format!("sboms/{}/{}.json", project_id, sbom_id);
        self.storage.save_file(&storage_key, content).await?;

        // Save metadata & components in store
        let saved = self.store.save_sbom(doc, parsed_data.components).await?;
        Ok((saved, component_count))
    }

    // --- Vulnerability & Scanner Ingestion Service ---
    pub async fn ingest_scan_report(
        &self,
        org_id: Uuid,
        project_id: Uuid,
        release_id: Option<Uuid>,
        content: &[u8],
    ) -> Result<usize> {
        let json_str = std::str::from_utf8(content)
            .map_err(|_| AppError::Validation("Scan report must be valid UTF-8".into()))?;

        let findings = scanner::parse_scan_report(org_id, project_id, release_id, json_str)?;
        let count = findings.len();

        // Save scan artifact
        let storage_key = format!("scans/{}/{}_{}.json", project_id, org_id, now_utc().timestamp());
        let _ = self.storage.save_file(&storage_key, content).await;

        self.store.save_findings(findings).await?;
        Ok(count)
    }

    // --- VEX Service ---
    pub async fn record_vex_decision(
        &self,
        org_id: Uuid,
        project_id: Uuid,
        release_id: Option<Uuid>,
        finding_id: Option<Uuid>,
        vuln_id: &str,
        status: VexStatus,
        justification: Option<VexJustification>,
        statement_notes: &str,
        author_id: Uuid,
        author_name: &str,
        author_email: &str,
    ) -> Result<VexStatement> {
        // Enforce justification when marked not affected
        if status == VexStatus::NotAffected && justification.is_none() {
            return Err(AppError::Validation(
                "A formal justification code is required when claiming a component is Not Affected by a vulnerability.".into(),
            ));
        }

        let history_entry = VexDecisionRecord {
            id: new_id(),
            timestamp: now_utc(),
            author_name: author_name.to_string(),
            author_email: author_email.to_string(),
            status,
            justification,
            notes: statement_notes.to_string(),
        };

        let statement = VexStatement {
            id: new_id(),
            organization_id: org_id,
            project_id,
            release_id,
            finding_id,
            vuln_id: vuln_id.trim().to_uppercase(),
            status,
            justification,
            statement_notes: statement_notes.trim().to_string(),
            author_id,
            author_name: author_name.to_string(),
            is_approved: false,
            approved_by: None,
            decision_history: vec![history_entry],
            created_at: now_utc(),
            updated_at: now_utc(),
        };

        self.store.save_vex_statement(statement).await
    }

    pub async fn approve_vex_statement(
        &self,
        org_id: &Uuid,
        statement_id: &Uuid,
        reviewer_id: Uuid,
    ) -> Result<VexStatement> {
        let mut stmt = self
            .store
            .get_vex_statement(org_id, statement_id)
            .await
            .ok_or_else(|| AppError::NotFound("VEX statement not found".into()))?;

        stmt.is_approved = true;
        stmt.approved_by = Some(reviewer_id);
        stmt.updated_at = now_utc();

        self.store.save_vex_statement(stmt).await
    }

    // --- Evidence Package Generation Service ---
    pub async fn generate_evidence_package(
        &self,
        org_id: Uuid,
        project_id: Uuid,
        release_id: Uuid,
    ) -> Result<(EvidencePackage, Vec<u8>)> {
        let project = self
            .store
            .get_project(&org_id, &project_id)
            .await
            .ok_or_else(|| AppError::NotFound("Project not found".into()))?;

        let releases = self.store.list_releases(&project_id).await;
        let release = releases
            .into_iter()
            .find(|r| r.id == release_id)
            .ok_or_else(|| AppError::NotFound("Release not found".into()))?;

        // Collect Release SBOM
        let sboms = self.store.list_sboms(&org_id, Some(project_id)).await;
        let mut sbom_raw_bytes = None;
        if let Some(doc) = sboms.iter().find(|s| s.release_id == Some(release_id)) {
            let key = format!("sboms/{}/{}.json", project_id, doc.id);
            if let Ok(bytes) = self.storage.read_file(&key).await {
                sbom_raw_bytes = Some(bytes);
            }
        }

        // Collect VEX statements for release
        let vex_list = self.store.list_vex_statements(&org_id, Some(project_id)).await;
        let release_vex: Vec<_> = vex_list
            .into_iter()
            .filter(|v| v.release_id == Some(release_id) || v.release_id.is_none())
            .collect();
        let vex_json = serde_json::to_string_pretty(&release_vex).ok();

        // Build ZIP
        let (pkg, zip_bytes) = EvidencePackager::build_package_zip(
            org_id,
            project_id,
            release_id,
            &project.product_identifier,
            &release.version,
            sbom_raw_bytes.as_deref(),
            vex_json.as_deref(),
            &[],
        )?;

        // Store package zip
        self.storage.save_file(&pkg.storage_key, &zip_bytes).await?;
        let saved_pkg = self.store.save_evidence_package(pkg).await?;

        Ok((saved_pkg, zip_bytes))
    }
}
