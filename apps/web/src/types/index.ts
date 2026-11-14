export type OrgRole = 'owner' | 'admin' | 'developer' | 'security_reviewer' | 'read_only';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
}

export interface Project {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  repository_url?: string;
  default_branch: string;
  product_identifier: string;
  created_at: string;
  updated_at: string;
}

export interface Release {
  id: string;
  project_id: string;
  version: string;
  commit_sha?: string;
  released_at: string;
  created_at: string;
}

export interface SbomDocument {
  id: string;
  organization_id: string;
  project_id: string;
  release_id?: string;
  format: 'cyclonedx_json' | 'spdx_json' | 'custom';
  spec_version: string;
  component_count: number;
  sha256_hash: string;
  file_size_bytes: number;
  created_at: string;
}

export interface Component {
  id: string;
  sbom_id: string;
  name: string;
  version: string;
  purl?: string;
  license?: string;
  supplier?: string;
  component_type: string;
}

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'unknown';
export type RemediationStatus = 'open' | 'under_review' | 'mitigated' | 'resolved' | 'ignored';

export interface VulnerabilityFinding {
  id: string;
  organization_id: string;
  project_id: string;
  release_id?: string;
  vuln_id: string;
  severity: Severity;
  cvss_score?: number;
  affected_package: string;
  affected_version: string;
  fixed_version?: string;
  description: string;
  advisory_url?: string;
  scanner_source: string;
  remediation_status: RemediationStatus;
  first_seen_at: string;
  last_seen_at: string;
}

export type VexStatus = 'not_affected' | 'affected' | 'fixed' | 'under_investigation';
export type VexJustification =
  | 'component_not_present'
  | 'vulnerable_code_not_present'
  | 'vulnerable_code_cannot_be_controlled_by_adversary'
  | 'vulnerable_code_not_in_execute_path'
  | 'inline_mitigations_already_exist'
  | 'requires_privileges'
  | 'requires_user_interaction';

export interface VexDecisionRecord {
  id: string;
  timestamp: string;
  author_name: string;
  author_email: string;
  status: VexStatus;
  justification?: VexJustification;
  notes: string;
}

export interface VexStatement {
  id: string;
  organization_id: string;
  project_id: string;
  release_id?: string;
  finding_id?: string;
  vuln_id: string;
  status: VexStatus;
  justification?: VexJustification;
  statement_notes: string;
  author_id: string;
  author_name: string;
  is_approved: boolean;
  approved_by?: string;
  decision_history: VexDecisionRecord[];
  created_at: string;
  updated_at: string;
}

export interface EvidenceFileEntry {
  file_name: string;
  file_type: string;
  sha256_hash: string;
  size_bytes: number;
}

export interface EvidencePackage {
  id: string;
  organization_id: string;
  project_id: string;
  release_id: string;
  package_version: string;
  sha256_hash: string;
  file_entries: EvidenceFileEntry[];
  storage_key: string;
  created_at: string;
}

export interface OverviewMetrics {
  organization_id: string;
  total_projects: number;
  total_components: number;
  total_sboms: number;
  open_vulnerabilities: number;
  critical_vulnerabilities: number;
  high_vulnerabilities: number;
  pending_vex_decisions: number;
  evidence_packages_count: number;
  recent_projects: Project[];
  recent_findings: VulnerabilityFinding[];
}
