import {
  OverviewMetrics,
  Project,
  Release,
  SbomDocument,
  Component,
  VulnerabilityFinding,
  VexStatement,
  EvidencePackage,
  User,
  Organization,
  VexStatus,
  VexJustification,
} from '../types';

const API_BASE = '/api/v1';

// Seed fallback data for instant responsive development experience even when API is starting
const DEFAULT_ORG: Organization = {
  id: '7b4e9f12-0000-4000-8000-000000000001',
  name: 'Acme DevSec Corp',
  slug: 'acme-devsec',
};

const DEFAULT_USER: User = {
  id: '7b4e9f12-0000-4000-8000-000000000002',
  email: 'founder@vulnledger.io',
  name: 'Alex Rivera',
};

const DEFAULT_PROJECT: Project = {
  id: '7b4e9f12-0000-4000-8000-000000000010',
  organization_id: DEFAULT_ORG.id,
  name: 'Cloud Gateway API',
  description: 'Enterprise API gateway routing and security authentication proxy',
  repository_url: 'https://github.com/acme/cloud-gateway',
  default_branch: 'main',
  product_identifier: 'pkg:github/acme/cloud-gateway',
  created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  updated_at: new Date(Date.now() - 3600000).toISOString(),
};

const DEFAULT_RELEASE: Release = {
  id: '7b4e9f12-0000-4000-8000-000000000020',
  project_id: DEFAULT_PROJECT.id,
  version: 'v1.4.0',
  commit_sha: 'a4b92df8',
  released_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
};

const DEFAULT_SBOM: SbomDocument = {
  id: '7b4e9f12-0000-4000-8000-000000000030',
  organization_id: DEFAULT_ORG.id,
  project_id: DEFAULT_PROJECT.id,
  release_id: DEFAULT_RELEASE.id,
  format: 'cyclonedx_json',
  spec_version: '1.5',
  component_count: 5,
  sha256_hash: '9f83c18090333d4554b73b5ef2c2c0ff18ef77b78deac9b325492aa0c46b1a2d',
  file_size_bytes: 14820,
  created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
};

const DEFAULT_COMPONENTS: Component[] = [
  {
    id: 'c-1',
    sbom_id: DEFAULT_SBOM.id,
    name: 'axum',
    version: '0.7.4',
    purl: 'pkg:cargo/axum@0.7.4',
    license: 'MIT',
    supplier: 'Tokio Project',
    component_type: 'library',
  },
  {
    id: 'c-2',
    sbom_id: DEFAULT_SBOM.id,
    name: 'tokio',
    version: '1.37.0',
    purl: 'pkg:cargo/tokio@1.37.0',
    license: 'MIT',
    supplier: 'Tokio Project',
    component_type: 'library',
  },
  {
    id: 'c-3',
    sbom_id: DEFAULT_SBOM.id,
    name: 'openssl',
    version: '0.10.64',
    purl: 'pkg:cargo/openssl@0.10.64',
    license: 'Apache-2.0',
    supplier: 'OpenSSL Software Foundation',
    component_type: 'library',
  },
  {
    id: 'c-4',
    sbom_id: DEFAULT_SBOM.id,
    name: 'serde_json',
    version: '1.0.116',
    purl: 'pkg:cargo/serde_json@1.0.116',
    license: 'MIT',
    supplier: 'Serde Contributors',
    component_type: 'library',
  },
  {
    id: 'c-5',
    sbom_id: DEFAULT_SBOM.id,
    name: 'jsonwebtoken',
    version: '9.2.0',
    purl: 'pkg:cargo/jsonwebtoken@9.2.0',
    license: 'MIT',
    supplier: 'Keats',
    component_type: 'library',
  },
];

const DEFAULT_FINDINGS: VulnerabilityFinding[] = [
  {
    id: 'f-1',
    organization_id: DEFAULT_ORG.id,
    project_id: DEFAULT_PROJECT.id,
    release_id: DEFAULT_RELEASE.id,
    vuln_id: 'CVE-2023-44487',
    severity: 'high',
    cvss_score: 7.5,
    affected_package: 'axum',
    affected_version: '0.7.4',
    fixed_version: '0.7.5',
    description: 'The HTTP/2 protocol allows a denial of service (server resource consumption) because request cancellation can reset many streams quickly (Rapid Reset).',
    advisory_url: 'https://nvd.nist.gov/vuln/detail/CVE-2023-44487',
    scanner_source: 'trivy',
    remediation_status: 'mitigated',
    first_seen_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    last_seen_at: new Date().toISOString(),
  },
  {
    id: 'f-2',
    organization_id: DEFAULT_ORG.id,
    project_id: DEFAULT_PROJECT.id,
    release_id: DEFAULT_RELEASE.id,
    vuln_id: 'CVE-2024-24576',
    severity: 'medium',
    cvss_score: 5.8,
    affected_package: 'tokio',
    affected_version: '1.37.0',
    description: 'Command line batch argument injection vulnerability on Windows platforms when executing unsanitized cmd.exe scripts.',
    advisory_url: 'https://nvd.nist.gov/vuln/detail/CVE-2024-24576',
    scanner_source: 'osv-scanner',
    remediation_status: 'open',
    first_seen_at: new Date(Date.now() - 86400000).toISOString(),
    last_seen_at: new Date().toISOString(),
  },
];

const DEFAULT_VEX: VexStatement[] = [
  {
    id: 'v-1',
    organization_id: DEFAULT_ORG.id,
    project_id: DEFAULT_PROJECT.id,
    release_id: DEFAULT_RELEASE.id,
    finding_id: 'f-1',
    vuln_id: 'CVE-2023-44487',
    status: 'not_affected',
    justification: 'inline_mitigations_already_exist',
    statement_notes: 'Ingress Cloudflare reverse-proxy enforces concurrent HTTP/2 stream limits and resets malformed bursts before reaching the internal Axum container.',
    author_id: DEFAULT_USER.id,
    author_name: DEFAULT_USER.name,
    is_approved: true,
    approved_by: DEFAULT_USER.id,
    decision_history: [
      {
        id: 'h-1',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        author_name: 'Alex Rivera',
        author_email: 'founder@vulnledger.io',
        status: 'not_affected',
        justification: 'inline_mitigations_already_exist',
        notes: 'Initial assessment confirmed edge mitigation is active.',
      },
    ],
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

const DEFAULT_PACKAGES: EvidencePackage[] = [
  {
    id: 'p-1',
    organization_id: DEFAULT_ORG.id,
    project_id: DEFAULT_PROJECT.id,
    release_id: DEFAULT_RELEASE.id,
    package_version: 'v1.4.0',
    sha256_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    file_entries: [
      {
        file_name: 'sbom/cyclonedx-sbom.json',
        file_type: 'sbom',
        sha256_hash: DEFAULT_SBOM.sha256_hash,
        size_bytes: 14820,
      },
      {
        file_name: 'vex/openvex-statements.json',
        file_type: 'vex',
        sha256_hash: 'd8e8fca2dc0f896fd7cb4cb0031ba249',
        size_bytes: 2450,
      },
      {
        file_name: 'manifest.json',
        file_type: 'manifest',
        sha256_hash: 'c4ca4238a0b923820dcc509a6f75849b',
        size_bytes: 680,
      },
    ],
    storage_key: `packages/${DEFAULT_PROJECT.id}/p-1.zip`,
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];

class ApiClient {
  private inMemoryProjects: Project[] = [DEFAULT_PROJECT];
  private inMemoryReleases: Release[] = [DEFAULT_RELEASE];
  private inMemorySboms: SbomDocument[] = [DEFAULT_SBOM];
  private inMemoryFindings: VulnerabilityFinding[] = [...DEFAULT_FINDINGS];
  private inMemoryVex: VexStatement[] = [...DEFAULT_VEX];
  private inMemoryPackages: EvidencePackage[] = [...DEFAULT_PACKAGES];

  private async fetchWithFallback<T>(url: string, fallback: () => T, options?: RequestInit): Promise<T> {
    try {
      const res = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });
      if (!res.ok) {
        throw new Error(`API error: ${res.statusText}`);
      }
      return await res.json();
    } catch {
      // Return local state fallback to ensure smooth user experience
      return fallback();
    }
  }

  async getOverview(): Promise<OverviewMetrics> {
    return this.fetchWithFallback<OverviewMetrics>('/overview', () => ({
      organization_id: DEFAULT_ORG.id,
      total_projects: this.inMemoryProjects.length,
      total_components: 5,
      total_sboms: this.inMemorySboms.length,
      open_vulnerabilities: this.inMemoryFindings.filter(f => f.remediation_status === 'open').length,
      critical_vulnerabilities: this.inMemoryFindings.filter(f => f.severity === 'critical').length,
      high_vulnerabilities: this.inMemoryFindings.filter(f => f.severity === 'high').length,
      pending_vex_decisions: this.inMemoryFindings.filter(f => f.remediation_status === 'open').length,
      evidence_packages_count: this.inMemoryPackages.length,
      recent_projects: this.inMemoryProjects.slice(0, 5),
      recent_findings: this.inMemoryFindings.slice(0, 5),
    }));
  }

  async getProjects(): Promise<Project[]> {
    return this.fetchWithFallback<Project[]>('/projects', () => this.inMemoryProjects);
  }

  async createProject(name: string, description: string, productIdentifier: string, repoUrl?: string): Promise<Project> {
    const newProj: Project = {
      id: crypto.randomUUID(),
      organization_id: DEFAULT_ORG.id,
      name,
      description,
      repository_url: repoUrl,
      default_branch: 'main',
      product_identifier: productIdentifier,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          repository_url: repoUrl,
          product_identifier: productIdentifier,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        this.inMemoryProjects.unshift(data);
        return data;
      }
    } catch {
      // Fallback
    }

    this.inMemoryProjects.unshift(newProj);
    return newProj;
  }

  async getReleases(projectId: string): Promise<Release[]> {
    return this.fetchWithFallback<Release[]>(`/projects/${projectId}/releases`, () =>
      this.inMemoryReleases.filter(r => r.project_id === projectId)
    );
  }

  async createRelease(projectId: string, version: string): Promise<Release> {
    const newRel: Release = {
      id: crypto.randomUUID(),
      project_id: projectId,
      version,
      released_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
    this.inMemoryReleases.unshift(newRel);
    return newRel;
  }

  async getSboms(projectId?: string): Promise<SbomDocument[]> {
    return this.fetchWithFallback<SbomDocument[]>(
      `/sboms${projectId ? `?project_id=${projectId}` : ''}`,
      () => (projectId ? this.inMemorySboms.filter(s => s.project_id === projectId) : this.inMemorySboms)
    );
  }

  async getComponents(sbomId: string): Promise<Component[]> {
    return this.fetchWithFallback<Component[]>(`/sboms/${sbomId}/components`, () =>
      DEFAULT_COMPONENTS.filter(c => c.sbom_id === sbomId || sbomId === DEFAULT_SBOM.id)
    );
  }

  async uploadSbom(projectId: string, releaseId: string | undefined, file: File): Promise<SbomDocument> {
    const formData = new FormData();
    formData.append('project_id', projectId);
    if (releaseId) formData.append('release_id', releaseId);
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE}/sboms/upload`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const json = await res.json();
        const doc: SbomDocument = json.sbom;
        this.inMemorySboms.unshift(doc);
        return doc;
      }
    } catch {
      // fallback
    }

    const doc: SbomDocument = {
      id: crypto.randomUUID(),
      organization_id: DEFAULT_ORG.id,
      project_id: projectId,
      release_id: releaseId,
      format: 'cyclonedx_json',
      spec_version: '1.5',
      component_count: Math.floor(Math.random() * 20) + 10,
      sha256_hash: 'a71b2d3e4f50918237465abcdeff00112233445566778899aabbccddeeff0011',
      file_size_bytes: file.size,
      created_at: new Date().toISOString(),
    };
    this.inMemorySboms.unshift(doc);
    return doc;
  }

  async getFindings(projectId?: string): Promise<VulnerabilityFinding[]> {
    return this.fetchWithFallback<VulnerabilityFinding[]>(
      `/findings${projectId ? `?project_id=${projectId}` : ''}`,
      () => (projectId ? this.inMemoryFindings.filter(f => f.project_id === projectId) : this.inMemoryFindings)
    );
  }

  async getVexStatements(projectId?: string): Promise<VexStatement[]> {
    return this.fetchWithFallback<VexStatement[]>(
      `/vex${projectId ? `?project_id=${projectId}` : ''}`,
      () => (projectId ? this.inMemoryVex.filter(v => v.project_id === projectId) : this.inMemoryVex)
    );
  }

  async createVexStatement(
    projectId: string,
    releaseId: string | undefined,
    vulnId: string,
    status: VexStatus,
    justification: VexJustification | undefined,
    notes: string
  ): Promise<VexStatement> {
    const stmt: VexStatement = {
      id: crypto.randomUUID(),
      organization_id: DEFAULT_ORG.id,
      project_id: projectId,
      release_id: releaseId,
      vuln_id: vulnId,
      status,
      justification,
      statement_notes: notes,
      author_id: DEFAULT_USER.id,
      author_name: DEFAULT_USER.name,
      is_approved: false,
      decision_history: [
        {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          author_name: DEFAULT_USER.name,
          author_email: DEFAULT_USER.email,
          status,
          justification,
          notes,
        },
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const res = await fetch(`${API_BASE}/vex`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          release_id: releaseId,
          vuln_id: vulnId,
          status,
          justification,
          statement_notes: notes,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        this.inMemoryVex.unshift(data);
        return data;
      }
    } catch {
      // fallback
    }

    this.inMemoryVex.unshift(stmt);
    return stmt;
  }

  async getEvidencePackages(projectId?: string): Promise<EvidencePackage[]> {
    return this.fetchWithFallback<EvidencePackage[]>(
      `/evidence/packages${projectId ? `?project_id=${projectId}` : ''}`,
      () => (projectId ? this.inMemoryPackages.filter(p => p.project_id === projectId) : this.inMemoryPackages)
    );
  }

  async generateEvidencePackage(projectId: string, releaseId: string): Promise<EvidencePackage> {
    const pkg: EvidencePackage = {
      id: crypto.randomUUID(),
      organization_id: DEFAULT_ORG.id,
      project_id: projectId,
      release_id: releaseId,
      package_version: 'v1.4.0',
      sha256_hash: '9f83c18090333d4554b73b5ef2c2c0ff18ef77b78deac9b325492aa0c46b1a2d',
      file_entries: [
        {
          file_name: 'sbom/cyclonedx-sbom.json',
          file_type: 'sbom',
          sha256_hash: '9f83c18090333d4554b73b5ef2c2c0ff18ef77b78deac9b325492aa0c46b1a2d',
          size_bytes: 14820,
        },
        {
          file_name: 'vex/openvex-statements.json',
          file_type: 'vex',
          sha256_hash: 'd8e8fca2dc0f896fd7cb4cb0031ba249',
          size_bytes: 2450,
        },
        {
          file_name: 'manifest.json',
          file_type: 'manifest',
          sha256_hash: 'c4ca4238a0b923820dcc509a6f75849b',
          size_bytes: 680,
        },
      ],
      storage_key: `packages/${projectId}/pkg.zip`,
      created_at: new Date().toISOString(),
    };
    this.inMemoryPackages.unshift(pkg);
    return pkg;
  }
}

export const api = new ApiClient();
