use vulnledger_domain::*;
use vulnledger_shared::{now_utc, AppError, Result};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use uuid::Uuid;

#[derive(Clone, Default)]
pub struct AppStateStore {
    pub users: Arc<RwLock<HashMap<Uuid, User>>>,
    pub users_by_email: Arc<RwLock<HashMap<String, Uuid>>>,
    pub organizations: Arc<RwLock<HashMap<Uuid, Organization>>>,
    pub memberships: Arc<RwLock<Vec<OrgMembership>>>,
    pub projects: Arc<RwLock<HashMap<Uuid, Project>>>,
    pub releases: Arc<RwLock<HashMap<Uuid, Release>>>,
    pub sboms: Arc<RwLock<HashMap<Uuid, SbomDocument>>>,
    pub components: Arc<RwLock<Vec<Component>>>,
    pub findings: Arc<RwLock<HashMap<Uuid, VulnerabilityFinding>>>,
    pub vex_statements: Arc<RwLock<HashMap<Uuid, VexStatement>>>,
    pub evidence_packages: Arc<RwLock<HashMap<Uuid, EvidencePackage>>>,
}

impl AppStateStore {
    pub fn new() -> Self {
        Self::default()
    }

    // --- Users & Orgs ---
    pub async fn create_user(&self, user: User) -> Result<User> {
        let mut by_email = self.users_by_email.write().await;
        if by_email.contains_key(&user.email) {
            return Err(AppError::Conflict("Email already registered".into()));
        }
        by_email.insert(user.email.clone(), user.id);
        let mut users = self.users.write().await;
        users.insert(user.id, user.clone());
        Ok(user)
    }

    pub async fn get_user_by_email(&self, email: &str) -> Option<User> {
        let by_email = self.users_by_email.read().await;
        if let Some(id) = by_email.get(email) {
            let users = self.users.read().await;
            users.get(id).cloned()
        } else {
            None
        }
    }

    pub async fn get_user(&self, id: &Uuid) -> Option<User> {
        let users = self.users.read().await;
        users.get(id).cloned()
    }

    pub async fn create_organization(&self, org: Organization, owner_id: Uuid) -> Result<Organization> {
        let mut orgs = self.organizations.write().await;
        orgs.insert(org.id, org.clone());

        let mut mems = self.memberships.write().await;
        mems.push(OrgMembership {
            id: Uuid::new_v4(),
            organization_id: org.id,
            user_id: owner_id,
            role: OrgRole::Owner,
            created_at: now_utc(),
        });
        Ok(org)
    }

    pub async fn get_organization(&self, id: &Uuid) -> Option<Organization> {
        let orgs = self.organizations.read().await;
        orgs.get(id).cloned()
    }

    pub async fn list_user_organizations(&self, user_id: &Uuid) -> Vec<Organization> {
        let mems = self.memberships.read().await;
        let org_ids: Vec<Uuid> = mems.iter()
            .filter(|m| m.user_id == *user_id)
            .map(|m| m.organization_id)
            .collect();

        let orgs = self.organizations.read().await;
        org_ids.iter().filter_map(|id| orgs.get(id).cloned()).collect()
    }

    // --- Projects & Releases ---
    pub async fn create_project(&self, project: Project) -> Result<Project> {
        let mut projs = self.projects.write().await;
        projs.insert(project.id, project.clone());
        Ok(project)
    }

    pub async fn list_projects(&self, org_id: &Uuid) -> Vec<Project> {
        let projs = self.projects.read().await;
        projs.values()
            .filter(|p| p.organization_id == *org_id)
            .cloned()
            .collect()
    }

    pub async fn get_project(&self, org_id: &Uuid, id: &Uuid) -> Option<Project> {
        let projs = self.projects.read().await;
        projs.get(id).filter(|p| p.organization_id == *org_id).cloned()
    }

    pub async fn create_release(&self, release: Release) -> Result<Release> {
        let mut rels = self.releases.write().await;
        rels.insert(release.id, release.clone());
        Ok(release)
    }

    pub async fn list_releases(&self, project_id: &Uuid) -> Vec<Release> {
        let rels = self.releases.read().await;
        rels.values()
            .filter(|r| r.project_id == *project_id)
            .cloned()
            .collect()
    }

    // --- SBOM & Components ---
    pub async fn save_sbom(&self, doc: SbomDocument, comps: Vec<Component>) -> Result<SbomDocument> {
        let mut sboms = self.sboms.write().await;
        sboms.insert(doc.id, doc.clone());

        let mut all_comps = self.components.write().await;
        all_comps.extend(comps);
        Ok(doc)
    }

    pub async fn list_sboms(&self, org_id: &Uuid, project_id: Option<Uuid>) -> Vec<SbomDocument> {
        let sboms = self.sboms.read().await;
        sboms.values()
            .filter(|s| s.organization_id == *org_id && (project_id.is_none() || Some(s.project_id) == project_id))
            .cloned()
            .collect()
    }

    pub async fn get_sbom(&self, org_id: &Uuid, id: &Uuid) -> Option<SbomDocument> {
        let sboms = self.sboms.read().await;
        sboms.get(id).filter(|s| s.organization_id == *org_id).cloned()
    }

    pub async fn list_components(&self, sbom_id: &Uuid) -> Vec<Component> {
        let comps = self.components.read().await;
        comps.iter().filter(|c| c.sbom_id == *sbom_id).cloned().collect()
    }

    // --- Findings ---
    pub async fn save_findings(&self, items: Vec<VulnerabilityFinding>) -> Result<Vec<VulnerabilityFinding>> {
        let mut map = self.findings.write().await;
        for item in &items {
            map.insert(item.id, item.clone());
        }
        Ok(items)
    }

    pub async fn list_findings(&self, org_id: &Uuid, project_id: Option<Uuid>) -> Vec<VulnerabilityFinding> {
        let findings = self.findings.read().await;
        findings.values()
            .filter(|f| f.organization_id == *org_id && (project_id.is_none() || Some(f.project_id) == project_id))
            .cloned()
            .collect()
    }

    pub async fn get_finding(&self, org_id: &Uuid, id: &Uuid) -> Option<VulnerabilityFinding> {
        let findings = self.findings.read().await;
        findings.get(id).filter(|f| f.organization_id == *org_id).cloned()
    }

    // --- VEX ---
    pub async fn save_vex_statement(&self, stmt: VexStatement) -> Result<VexStatement> {
        let mut map = self.vex_statements.write().await;
        map.insert(stmt.id, stmt.clone());
        Ok(stmt)
    }

    pub async fn list_vex_statements(&self, org_id: &Uuid, project_id: Option<Uuid>) -> Vec<VexStatement> {
        let map = self.vex_statements.read().await;
        map.values()
            .filter(|v| v.organization_id == *org_id && (project_id.is_none() || Some(v.project_id) == project_id))
            .cloned()
            .collect()
    }

    pub async fn get_vex_statement(&self, org_id: &Uuid, id: &Uuid) -> Option<VexStatement> {
        let map = self.vex_statements.read().await;
        map.get(id).filter(|v| v.organization_id == *org_id).cloned()
    }

    // --- Evidence Packages ---
    pub async fn save_evidence_package(&self, pkg: EvidencePackage) -> Result<EvidencePackage> {
        let mut map = self.evidence_packages.write().await;
        map.insert(pkg.id, pkg.clone());
        Ok(pkg)
    }

    pub async fn list_evidence_packages(&self, org_id: &Uuid, project_id: Option<Uuid>) -> Vec<EvidencePackage> {
        let map = self.evidence_packages.read().await;
        map.values()
            .filter(|p| p.organization_id == *org_id && (project_id.is_none() || Some(p.project_id) == project_id))
            .cloned()
            .collect()
    }

    pub async fn get_evidence_package(&self, org_id: &Uuid, id: &Uuid) -> Option<EvidencePackage> {
        let map = self.evidence_packages.read().await;
        map.get(id).filter(|p| p.organization_id == *org_id).cloned()
    }
}
