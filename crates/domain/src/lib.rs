use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

// --- Identity & Access Management ---

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum OrgRole {
    Owner,
    Admin,
    Developer,
    SecurityReviewer,
    ReadOnly,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: Uuid,
    pub email: String,
    pub name: String,
    pub password_hash: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Organization {
    pub id: Uuid,
    pub name: String,
    pub slug: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OrgMembership {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub user_id: Uuid,
    pub role: OrgRole,
    pub created_at: DateTime<Utc>,
}

// --- Projects & Releases ---

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Project {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub name: String,
    pub description: Option<String>,
    pub repository_url: Option<String>,
    pub default_branch: String,
    pub product_identifier: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Release {
    pub id: Uuid,
    pub project_id: Uuid,
    pub version: String,
    pub commit_sha: Option<String>,
    pub released_at: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
}

// --- SBOM & Components ---

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SbomFormat {
    CycloneDxJson,
    SpdxJson,
    Custom,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SbomDocument {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub project_id: Uuid,
    pub release_id: Option<Uuid>,
    pub format: SbomFormat,
    pub spec_version: String,
    pub component_count: usize,
    pub sha256_hash: String,
    pub file_size_bytes: usize,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Component {
    pub id: Uuid,
    pub sbom_id: Uuid,
    pub name: String,
    pub version: String,
    pub purl: Option<String>,
    pub license: Option<String>,
    pub supplier: Option<String>,
    pub component_type: String, // library, framework, container, application
}

// --- Vulnerabilities & Findings ---

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Severity {
    Low,
    Medium,
    High,
    Critical,
    Unknown,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum RemediationStatus {
    Open,
    UnderReview,
    Mitigated,
    Resolved,
    Ignored,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VulnerabilityFinding {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub project_id: Uuid,
    pub release_id: Option<Uuid>,
    pub vuln_id: String, // CVE-2023-xxxx, GHSA-xxxx, OSV-xxxx
    pub severity: Severity,
    pub cvss_score: Option<f32>,
    pub affected_package: String,
    pub affected_version: String,
    pub fixed_version: Option<String>,
    pub description: String,
    pub advisory_url: Option<String>,
    pub scanner_source: String, // trivy, grype, osv-scanner
    pub remediation_status: RemediationStatus,
    pub first_seen_at: DateTime<Utc>,
    pub last_seen_at: DateTime<Utc>,
}

// --- VEX (Vulnerability Exploitability eXchange) ---

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum VexStatus {
    NotAffected,
    Affected,
    Fixed,
    UnderInvestigation,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum VexJustification {
    ComponentNotPresent,
    VulnerableCodeNotPresent,
    VulnerableCodeCannotBeControlledByAdversary,
    VulnerableCodeNotInExecutePath,
    InlineMitigationsAlreadyExist,
    RequiresPrivileges,
    RequiresUserInteraction,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VexDecisionRecord {
    pub id: Uuid,
    pub timestamp: DateTime<Utc>,
    pub author_name: String,
    pub author_email: String,
    pub status: VexStatus,
    pub justification: Option<VexJustification>,
    pub notes: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VexStatement {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub project_id: Uuid,
    pub release_id: Option<Uuid>,
    pub finding_id: Option<Uuid>,
    pub vuln_id: String,
    pub status: VexStatus,
    pub justification: Option<VexJustification>,
    pub statement_notes: String,
    pub author_id: Uuid,
    pub author_name: String,
    pub is_approved: bool,
    pub approved_by: Option<Uuid>,
    pub decision_history: Vec<VexDecisionRecord>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

// --- Evidence Center ---

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EvidenceFileEntry {
    pub file_name: String,
    pub file_type: String, // sbom, vex, scan_report, manifest
    pub sha256_hash: String,
    pub size_bytes: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EvidencePackage {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub project_id: Uuid,
    pub release_id: Uuid,
    pub package_version: String,
    pub sha256_hash: String,
    pub file_entries: Vec<EvidenceFileEntry>,
    pub storage_key: String,
    pub created_at: DateTime<Utc>,
}
