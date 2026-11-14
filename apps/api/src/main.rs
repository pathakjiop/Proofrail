use axum::{
    extract::{DefaultBodyLimit, Multipart, Path, Query, State},
    http::{header, HeaderMap, StatusCode},
    response::{IntoResponse, Response},
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::{net::SocketAddr, path::PathBuf, sync::Arc};
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;
use tracing::{info, warn};
use uuid::Uuid;

use vulnledger_application::AppServices;
use vulnledger_domain::*;
use vulnledger_infrastructure::{AppStateStore, LocalStorageService};
use vulnledger_shared::{now_utc, AppError};

#[derive(Clone)]
pub struct ApiState {
    pub services: Arc<AppServices>,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "info,vulnledger_api=debug,tower_http=debug".into()),
        )
        .init();

    info!("Starting VulnLedger API Server v0.1.0...");

    let storage_dir = std::env::var("STORAGE_PATH").unwrap_or_else(|_| "./storage/data".into());
    let storage = Arc::new(LocalStorageService::new(PathBuf::from(&storage_dir)));
    let store = AppStateStore::new();
    let services = Arc::new(AppServices::new(store, storage));

    // Seed default development data for immediate out-of-the-box exploration
    seed_dev_data(&services).await?;

    let state = ApiState { services };

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/healthz", get(healthz_handler))
        .route("/api/v1/doctor", get(doctor_handler))
        // Auth
        .route("/api/v1/auth/register", post(register_handler))
        .route("/api/v1/auth/login", post(login_handler))
        .route("/api/v1/auth/me", get(me_handler))
        // Organizations & Stats
        .route("/api/v1/overview", get(overview_handler))
        .route("/api/v1/organizations", get(list_organizations_handler))
        // Projects & Releases
        .route("/api/v1/projects", get(list_projects_handler).post(create_project_handler))
        .route("/api/v1/projects/{id}/releases", get(list_releases_handler).post(create_release_handler))
        // SBOMs
        .route("/api/v1/sboms", get(list_sboms_handler))
        .route("/api/v1/sboms/upload", post(upload_sbom_handler))
        .route("/api/v1/sboms/{id}/components", get(list_sbom_components_handler))
        // Findings
        .route("/api/v1/findings", get(list_findings_handler))
        .route("/api/v1/findings/import", post(import_findings_handler))
        // VEX
        .route("/api/v1/vex", get(list_vex_handler).post(create_vex_handler))
        .route("/api/v1/vex/{id}/approve", post(approve_vex_handler))
        // Evidence Packages
        .route("/api/v1/evidence/packages", get(list_evidence_packages_handler).post(generate_evidence_package_handler))
        .route("/api/v1/evidence/packages/{id}/download", get(download_evidence_package_handler))
        .layer(cors)
        .layer(TraceLayer::new_for_http())
        .layer(DefaultBodyLimit::max(50 * 1024 * 1024)) // 50MB
        .with_state(state);

    let port: u16 = std::env::var("PORT")
        .ok()
        .and_then(|p| p.parse().ok())
        .unwrap_or(8080);
    let addr = SocketAddr::from(([0, 0, 0, 0], port));

    info!("VulnLedger API listening on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}

// --- Error Response Helper ---

pub struct ApiError(pub AppError);

impl From<AppError> for ApiError {
    fn from(err: AppError) -> Self {
        ApiError(err)
    }
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let (status, error_message) = match self.0 {
            AppError::NotFound(msg) => (StatusCode::NOT_FOUND, msg),
            AppError::Validation(msg) => (StatusCode::BAD_REQUEST, msg),
            AppError::Unauthorized(msg) => (StatusCode::UNAUTHORIZED, msg),
            AppError::Forbidden(msg) => (StatusCode::FORBIDDEN, msg),
            AppError::Conflict(msg) => (StatusCode::CONFLICT, msg),
            AppError::ParseError(msg) => (StatusCode::UNPROCESSABLE_ENTITY, msg),
            AppError::Internal(msg) => {
                warn!("Internal server error: {}", msg);
                (StatusCode::INTERNAL_SERVER_ERROR, "Internal server error".into())
            }
        };

        let body = Json(serde_json::json!({
            "error": error_message,
            "status": status.as_u16(),
        }));

        (status, body).into_response()
    }
}

// --- Handlers ---

async fn healthz_handler() -> impl IntoResponse {
    Json(serde_json::json!({
        "status": "healthy",
        "service": "vulnledger-api",
        "timestamp": now_utc().to_rfc3339()
    }))
}

async fn doctor_handler() -> impl IntoResponse {
    Json(serde_json::json!({
        "status": "ok",
        "environment": "development",
        "database": "operational",
        "storage": "local-filesystem-verified",
        "integrations": {
            "syft": "compatible",
            "trivy": "compatible",
            "osv_scanner": "compatible",
            "openvex": "compatible"
        }
    }))
}

// --- Auth Handlers ---

#[derive(Deserialize)]
struct RegisterRequest {
    email: String,
    name: String,
    password: String,
    organization_name: String,
}

async fn register_handler(
    State(state): State<ApiState>,
    Json(payload): Json<RegisterRequest>,
) -> Result<impl IntoResponse, ApiError> {
    let (user, org) = state
        .services
        .register_user(&payload.email, &payload.name, &payload.password, &payload.organization_name)
        .await?;

    Ok((
        StatusCode::CREATED,
        Json(serde_json::json!({
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name
            },
            "organization": org,
            "token": format!("vlg_dev_{}", user.id)
        })),
    ))
}

#[derive(Deserialize)]
struct LoginRequest {
    email: String,
    password: String,
}

async fn login_handler(
    State(state): State<ApiState>,
    Json(payload): Json<LoginRequest>,
) -> Result<impl IntoResponse, ApiError> {
    let user = state.services.login_user(&payload.email, &payload.password).await?;
    let orgs = state.services.store.list_user_organizations(&user.id).await;

    Ok(Json(serde_json::json!({
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name
        },
        "organizations": orgs,
        "token": format!("vlg_dev_{}", user.id)
    })))
}

async fn me_handler(
    State(state): State<ApiState>,
    headers: HeaderMap,
) -> Result<impl IntoResponse, ApiError> {
    let user_id = extract_auth_user_id(&headers, &state).await?;
    let user = state
        .services
        .store
        .get_user(&user_id)
        .await
        .ok_or_else(|| AppError::NotFound("User not found".into()))?;

    let orgs = state.services.store.list_user_organizations(&user.id).await;

    Ok(Json(serde_json::json!({
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name
        },
        "organizations": orgs
    })))
}

// --- Overview Handler ---

#[derive(Deserialize)]
struct OrgQuery {
    org_id: Option<Uuid>,
}

async fn overview_handler(
    State(state): State<ApiState>,
    Query(query): Query<OrgQuery>,
    headers: HeaderMap,
) -> Result<impl IntoResponse, ApiError> {
    let org_id = get_effective_org_id(&headers, query.org_id, &state).await?;

    let projects = state.services.store.list_projects(&org_id).await;
    let sboms = state.services.store.list_sboms(&org_id, None).await;
    let findings = state.services.store.list_findings(&org_id, None).await;
    let vex_statements = state.services.store.list_vex_statements(&org_id, None).await;
    let evidence_packages = state.services.store.list_evidence_packages(&org_id, None).await;

    let critical_count = findings.iter().filter(|f| f.severity == Severity::Critical).count();
    let high_count = findings.iter().filter(|f| f.severity == Severity::High).count();
    let pending_vex_count = findings.iter().filter(|f| f.remediation_status == RemediationStatus::Open).count();
    let total_components: usize = sboms.iter().map(|s| s.component_count).sum();

    Ok(Json(serde_json::json!({
        "organization_id": org_id,
        "total_projects": projects.len(),
        "total_components": total_components,
        "total_sboms": sboms.len(),
        "open_vulnerabilities": findings.len(),
        "critical_vulnerabilities": critical_count,
        "high_vulnerabilities": high_count,
        "pending_vex_decisions": pending_vex_count,
        "evidence_packages_count": evidence_packages.len(),
        "recent_projects": projects.iter().take(5).collect::<Vec<_>>(),
        "recent_findings": findings.iter().take(5).collect::<Vec<_>>(),
    })))
}

async fn list_organizations_handler(
    State(state): State<ApiState>,
    headers: HeaderMap,
) -> Result<impl IntoResponse, ApiError> {
    let user_id = extract_auth_user_id(&headers, &state).await?;
    let orgs = state.services.store.list_user_organizations(&user_id).await;
    Ok(Json(orgs))
}

// --- Projects & Releases Handlers ---

#[derive(Deserialize)]
struct CreateProjectRequest {
    name: String,
    description: Option<String>,
    repository_url: Option<String>,
    default_branch: Option<String>,
    product_identifier: String,
    organization_id: Option<Uuid>,
}

async fn list_projects_handler(
    State(state): State<ApiState>,
    Query(query): Query<OrgQuery>,
    headers: HeaderMap,
) -> Result<impl IntoResponse, ApiError> {
    let org_id = get_effective_org_id(&headers, query.org_id, &state).await?;
    let projs = state.services.store.list_projects(&org_id).await;
    Ok(Json(projs))
}

async fn create_project_handler(
    State(state): State<ApiState>,
    headers: HeaderMap,
    Json(payload): Json<CreateProjectRequest>,
) -> Result<impl IntoResponse, ApiError> {
    let org_id = get_effective_org_id(&headers, payload.organization_id, &state).await?;
    let project = state
        .services
        .create_project(
            org_id,
            &payload.name,
            payload.description,
            payload.repository_url,
            payload.default_branch,
            &payload.product_identifier,
        )
        .await?;
    Ok((StatusCode::CREATED, Json(project)))
}

async fn list_releases_handler(
    State(state): State<ApiState>,
    Path(project_id): Path<Uuid>,
) -> Result<impl IntoResponse, ApiError> {
    let rels = state.services.store.list_releases(&project_id).await;
    Ok(Json(rels))
}

#[derive(Deserialize)]
struct CreateReleaseRequest {
    version: String,
    commit_sha: Option<String>,
}

async fn create_release_handler(
    State(state): State<ApiState>,
    Path(project_id): Path<Uuid>,
    Json(payload): Json<CreateReleaseRequest>,
) -> Result<impl IntoResponse, ApiError> {
    let rel = state
        .services
        .create_release(project_id, &payload.version, payload.commit_sha)
        .await?;
    Ok((StatusCode::CREATED, Json(rel)))
}

// --- SBOM Handlers ---

#[derive(Deserialize)]
struct SbomQuery {
    org_id: Option<Uuid>,
    project_id: Option<Uuid>,
}

async fn list_sboms_handler(
    State(state): State<ApiState>,
    Query(query): Query<SbomQuery>,
    headers: HeaderMap,
) -> Result<impl IntoResponse, ApiError> {
    let org_id = get_effective_org_id(&headers, query.org_id, &state).await?;
    let sboms = state.services.store.list_sboms(&org_id, query.project_id).await;
    Ok(Json(sboms))
}

async fn upload_sbom_handler(
    State(state): State<ApiState>,
    headers: HeaderMap,
    mut multipart: Multipart,
) -> Result<impl IntoResponse, ApiError> {
    let mut org_id_opt = None;
    let mut project_id_opt = None;
    let mut release_id_opt = None;
    let mut file_bytes_opt = None;

    while let Some(field) = multipart
        .next_field()
        .await
        .map_err(|e| AppError::Validation(format!("Multipart parse error: {}", e)))?
    {
        let name = field.name().unwrap_or("").to_string();
        if name == "organization_id" {
            let text = field.text().await.unwrap_or_default();
            org_id_opt = Uuid::parse_str(&text).ok();
        } else if name == "project_id" {
            let text = field.text().await.unwrap_or_default();
            project_id_opt = Uuid::parse_str(&text).ok();
        } else if name == "release_id" {
            let text = field.text().await.unwrap_or_default();
            release_id_opt = Uuid::parse_str(&text).ok();
        } else if name == "file" || name == "sbom" {
            let data = field
                .bytes()
                .await
                .map_err(|e| AppError::Validation(format!("Failed to read file: {}", e)))?;
            file_bytes_opt = Some(data.to_vec());
        }
    }

    let org_id = get_effective_org_id(&headers, org_id_opt, &state).await?;
    let project_id = project_id_opt.ok_or_else(|| AppError::Validation("project_id is required".into()))?;
    let file_bytes = file_bytes_opt.ok_or_else(|| AppError::Validation("No SBOM file provided in multipart payload".into()))?;

    let (doc, count) = state
        .services
        .ingest_sbom(org_id, project_id, release_id_opt, &file_bytes)
        .await?;

    Ok((
        StatusCode::CREATED,
        Json(serde_json::json!({
            "sbom": doc,
            "components_extracted": count
        })),
    ))
}

async fn list_sbom_components_handler(
    State(state): State<ApiState>,
    Path(sbom_id): Path<Uuid>,
) -> Result<impl IntoResponse, ApiError> {
    let components = state.services.store.list_components(&sbom_id).await;
    Ok(Json(components))
}

// --- Findings Handlers ---

#[derive(Deserialize)]
struct FindingQuery {
    org_id: Option<Uuid>,
    project_id: Option<Uuid>,
}

async fn list_findings_handler(
    State(state): State<ApiState>,
    Query(query): Query<FindingQuery>,
    headers: HeaderMap,
) -> Result<impl IntoResponse, ApiError> {
    let org_id = get_effective_org_id(&headers, query.org_id, &state).await?;
    let findings = state.services.store.list_findings(&org_id, query.project_id).await;
    Ok(Json(findings))
}

#[derive(Deserialize)]
struct ImportScanRequest {
    project_id: Uuid,
    release_id: Option<Uuid>,
    scan_json: String,
    organization_id: Option<Uuid>,
}

async fn import_findings_handler(
    State(state): State<ApiState>,
    headers: HeaderMap,
    Json(payload): Json<ImportScanRequest>,
) -> Result<impl IntoResponse, ApiError> {
    let org_id = get_effective_org_id(&headers, payload.organization_id, &state).await?;
    let count = state
        .services
        .ingest_scan_report(
            org_id,
            payload.project_id,
            payload.release_id,
            payload.scan_json.as_bytes(),
        )
        .await?;

    Ok(Json(serde_json::json!({
        "status": "imported",
        "findings_count": count
    })))
}

// --- VEX Handlers ---

#[derive(Deserialize)]
struct CreateVexRequest {
    project_id: Uuid,
    release_id: Option<Uuid>,
    finding_id: Option<Uuid>,
    vuln_id: String,
    status: VexStatus,
    justification: Option<VexJustification>,
    statement_notes: String,
    organization_id: Option<Uuid>,
}

async fn list_vex_handler(
    State(state): State<ApiState>,
    Query(query): Query<FindingQuery>,
    headers: HeaderMap,
) -> Result<impl IntoResponse, ApiError> {
    let org_id = get_effective_org_id(&headers, query.org_id, &state).await?;
    let vex_list = state.services.store.list_vex_statements(&org_id, query.project_id).await;
    Ok(Json(vex_list))
}

async fn create_vex_handler(
    State(state): State<ApiState>,
    headers: HeaderMap,
    Json(payload): Json<CreateVexRequest>,
) -> Result<impl IntoResponse, ApiError> {
    let user_id = extract_auth_user_id(&headers, &state).await?;
    let user = state.services.store.get_user(&user_id).await.unwrap();
    let org_id = get_effective_org_id(&headers, payload.organization_id, &state).await?;

    let stmt = state
        .services
        .record_vex_decision(
            org_id,
            payload.project_id,
            payload.release_id,
            payload.finding_id,
            &payload.vuln_id,
            payload.status,
            payload.justification,
            &payload.statement_notes,
            user.id,
            &user.name,
            &user.email,
        )
        .await?;

    Ok((StatusCode::CREATED, Json(stmt)))
}

async fn approve_vex_handler(
    State(state): State<ApiState>,
    Path(statement_id): Path<Uuid>,
    Query(query): Query<OrgQuery>,
    headers: HeaderMap,
) -> Result<impl IntoResponse, ApiError> {
    let user_id = extract_auth_user_id(&headers, &state).await?;
    let org_id = get_effective_org_id(&headers, query.org_id, &state).await?;
    let stmt = state
        .services
        .approve_vex_statement(&org_id, &statement_id, user_id)
        .await?;
    Ok(Json(stmt))
}

// --- Evidence Package Handlers ---

#[derive(Deserialize)]
struct GenerateEvidenceRequest {
    project_id: Uuid,
    release_id: Uuid,
    organization_id: Option<Uuid>,
}

async fn list_evidence_packages_handler(
    State(state): State<ApiState>,
    Query(query): Query<FindingQuery>,
    headers: HeaderMap,
) -> Result<impl IntoResponse, ApiError> {
    let org_id = get_effective_org_id(&headers, query.org_id, &state).await?;
    let pkgs = state.services.store.list_evidence_packages(&org_id, query.project_id).await;
    Ok(Json(pkgs))
}

async fn generate_evidence_package_handler(
    State(state): State<ApiState>,
    headers: HeaderMap,
    Json(payload): Json<GenerateEvidenceRequest>,
) -> Result<impl IntoResponse, ApiError> {
    let org_id = get_effective_org_id(&headers, payload.organization_id, &state).await?;
    let (pkg, _) = state
        .services
        .generate_evidence_package(org_id, payload.project_id, payload.release_id)
        .await?;

    Ok((StatusCode::CREATED, Json(pkg)))
}

async fn download_evidence_package_handler(
    State(state): State<ApiState>,
    Path(package_id): Path<Uuid>,
    Query(query): Query<OrgQuery>,
    headers: HeaderMap,
) -> Result<impl IntoResponse, ApiError> {
    let org_id = get_effective_org_id(&headers, query.org_id, &state).await?;
    let pkg = state
        .services
        .store
        .get_evidence_package(&org_id, &package_id)
        .await
        .ok_or_else(|| AppError::NotFound("Evidence package not found".into()))?;

    let file_bytes = state
        .services
        .storage
        .read_file(&pkg.storage_key)
        .await?;

    let mut resp_headers = HeaderMap::new();
    resp_headers.insert(header::CONTENT_TYPE, "application/zip".parse().unwrap());
    resp_headers.insert(
        header::CONTENT_DISPOSITION,
        format!("attachment; filename=\"evidence-{}-{}.zip\"", pkg.package_version, pkg.id).parse().unwrap(),
    );

    Ok((resp_headers, file_bytes))
}

// --- Helper Functions ---

async fn extract_auth_user_id(headers: &HeaderMap, state: &ApiState) -> Result<Uuid, AppError> {
    if let Some(auth) = headers.get("authorization").and_then(|h| h.to_str().ok()) {
        if let Some(token) = auth.strip_prefix("Bearer ") {
            if let Some(id_str) = token.strip_prefix("vlg_dev_") {
                if let Ok(id) = Uuid::parse_str(id_str) {
                    return Ok(id);
                }
            }
        }
    }
    // Fallback in dev: use primary demo user
    let user = state.services.store.get_user_by_email("founder@vulnledger.io").await;
    if let Some(u) = user {
        Ok(u.id)
    } else {
        Err(AppError::Unauthorized("Authentication required".into()))
    }
}

async fn get_effective_org_id(
    headers: &HeaderMap,
    explicit_org_id: Option<Uuid>,
    state: &ApiState,
) -> Result<Uuid, AppError> {
    if let Some(id) = explicit_org_id {
        return Ok(id);
    }
    let user_id = extract_auth_user_id(headers, state).await?;
    let orgs = state.services.store.list_user_organizations(&user_id).await;
    orgs.first()
        .map(|o| o.id)
        .ok_or_else(|| AppError::NotFound("No organization assigned to user".into()))
}

// --- Seed Development Data ---

async fn seed_dev_data(services: &AppServices) -> anyhow::Result<()> {
    info!("Seeding initial development workspace data...");
    let (user, org) = services
        .register_user(
            "founder@vulnledger.io",
            "Alex Rivera",
            "password123!",
            "Acme DevSec Corp",
        )
        .await?;

    // Create Sample Project: Cloud Gateway API
    let project = services
        .create_project(
            org.id,
            "Cloud Gateway API",
            Some("Enterprise API gateway routing and security authentication proxy".into()),
            Some("https://github.com/acme/cloud-gateway".into()),
            Some("main".into()),
            "pkg:github/acme/cloud-gateway",
        )
        .await?;

    let release_v1 = services
        .create_release(project.id, "v1.4.0", Some("a4b92df8".into()))
        .await?;

    // Ingest sample CycloneDX SBOM
    let sample_sbom = r#"{
        "bomFormat": "CycloneDX",
        "specVersion": "1.5",
        "serialNumber": "urn:uuid:3e671687-395b-41f5-a30f-a58921a69b79",
        "version": 1,
        "metadata": {
            "component": {
                "name": "cloud-gateway",
                "version": "1.4.0",
                "type": "application"
            }
        },
        "components": [
            {
                "name": "axum",
                "version": "0.7.4",
                "type": "library",
                "purl": "pkg:cargo/axum@0.7.4",
                "licenses": [{"license": {"id": "MIT"}}],
                "supplier": {"name": "Tokio Project"}
            },
            {
                "name": "tokio",
                "version": "1.37.0",
                "type": "library",
                "purl": "pkg:cargo/tokio@1.37.0",
                "licenses": [{"license": {"id": "MIT"}}],
                "supplier": {"name": "Tokio Project"}
            },
            {
                "name": "openssl",
                "version": "0.10.64",
                "type": "library",
                "purl": "pkg:cargo/openssl@0.10.64",
                "licenses": [{"license": {"id": "Apache-2.0"}}]
            },
            {
                "name": "serde_json",
                "version": "1.0.116",
                "type": "library",
                "purl": "pkg:cargo/serde_json@1.0.116",
                "licenses": [{"license": {"id": "MIT"}}]
            },
            {
                "name": "jsonwebtoken",
                "version": "9.2.0",
                "type": "library",
                "purl": "pkg:cargo/jsonwebtoken@9.2.0",
                "licenses": [{"license": {"id": "MIT"}}]
            }
        ]
    }"#;

    let (sbom_doc, _) = services
        .ingest_sbom(org.id, project.id, Some(release_v1.id), sample_sbom.as_bytes())
        .await?;

    // Ingest sample scan report findings
    let sample_scan = r#"{
        "SchemaVersion": 2,
        "Results": [
            {
                "Target": "Cargo.lock",
                "Class": "lang-pkgs",
                "Type": "cargo",
                "Vulnerabilities": [
                    {
                        "VulnerabilityID": "CVE-2023-44487",
                        "PkgName": "axum",
                        "InstalledVersion": "0.7.4",
                        "FixedVersion": "0.7.5",
                        "Severity": "HIGH",
                        "Title": "HTTP/2 Rapid Reset Attack vector",
                        "Description": "The HTTP/2 protocol allows a denial of service (server resource consumption) because request cancellation can reset many streams quickly.",
                        "PrimaryURL": "https://nvd.nist.gov/vuln/detail/CVE-2023-44487",
                        "CVSS": {
                            "nvd": { "V3Score": 7.5 }
                        }
                    },
                    {
                        "VulnerabilityID": "CVE-2024-24576",
                        "PkgName": "tokio",
                        "InstalledVersion": "1.37.0",
                        "Severity": "MEDIUM",
                        "Title": "Command line argument injection vulnerability",
                        "Description": "Standard library command batch file execution issue on Windows.",
                        "PrimaryURL": "https://nvd.nist.gov/vuln/detail/CVE-2024-24576",
                        "CVSS": {
                            "nvd": { "V3Score": 5.8 }
                        }
                    }
                ]
            }
        ]
    }"#;

    services
        .ingest_scan_report(org.id, project.id, Some(release_v1.id), sample_scan.as_bytes())
        .await?;

    // Record an active VEX Decision
    let stmt = services
        .record_vex_decision(
            org.id,
            project.id,
            Some(release_v1.id),
            None,
            "CVE-2023-44487",
            VexStatus::NotAffected,
            Some(VexJustification::InlineMitigationsAlreadyExist),
            "Ingress Cloudflare reverse-proxy enforces concurrent HTTP/2 stream limits and resets malformed bursts before reaching the internal Axum container.",
            user.id,
            &user.name,
            &user.email,
        )
        .await?;

    services.approve_vex_statement(&org.id, &stmt.id, user.id).await?;

    // Generate initial Evidence Package
    services
        .generate_evidence_package(org.id, project.id, release_v1.id)
        .await?;

    info!("Dev seed data initialization complete.");
    Ok(())
}
