# VulnLedger System Architecture

## 1. Overview & High-Level Topology

VulnLedger is an open-core software supply chain security and evidence management platform. Rather than building a redundant vulnerability scanner, VulnLedger operates as the **security decision, evidence, and workflow management layer** that ingests outputs from mature open-source tooling (Syft, Trivy, OSV-Scanner, Grype) and manages the full lifecycle of SBOMs, VEX exploitability statements, and tamper-evident release evidence packages.

```
┌────────────────────────────────────────────────────────┐
│                   VulnLedger Frontend                  │
│       React + TypeScript + Vite + Tailwind CSS         │
│          (Three-Column Developer Workspace)            │
└───────────────────────────▲────────────────────────────┘
                            │ REST API (JSON)
┌───────────────────────────▼────────────────────────────┐
│                    VulnLedger API                      │
│             Axum 0.8 + Tokio Async Runtime             │
├────────────────────────────────────────────────────────┤
│ Application Layer (Services: SBOM, VEX, Evidence, etc.)│
├────────────────────────────────────────────────────────┤
│ Domain Models (Pure Entities, Value Objects, RBAC)     │
├────────────────────────────────────────────────────────┤
│ Infrastructure Layer (SQLx Repositories, File Storage) │
└───────────────────────────▲────────────────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        ▼                                       ▼
┌───────────────┐                       ┌───────────────┐
│  PostgreSQL   │                       │ Local / S3    │
│  (DB Engine)  │                       │ Artifact Store│
└───────────────┘                       └───────────────┘
        ▲
        │
┌───────┴───────┐
│ VulnLedger CLI│  <-- Standalone Rust Binary (Clap + Serde)
│  (vulnledger) │      Local SBOM validation, VEX creation, CI push
└───────────────┘
```

## 2. Monorepo Organization

The project is structured as a Rust cargo workspace paired with a high-performance TypeScript frontend:

- `apps/web`: React 18+ application with custom design system matching minimalist dock aesthetic.
- `apps/api`: REST API gateway built with Axum, handling authentication, tenant isolation, file streaming, and background task dispatch.
- `apps/cli`: Standalone CLI tool for developers and CI/CD pipelines.
- `crates/domain`: Pure domain logic containing business rules, states, and entities with no I/O dependencies.
- `crates/application`: Application services executing workflows, coordinating persistence, and orchestrating business operations.
- `crates/infrastructure`: Implementations for SQLx PostgreSQL/SQLite persistence, filesystem/S3 artifact storage, and standard parsers (CycloneDX, SPDX, CSAF, OpenVEX).
- `crates/shared`: Common error representations, cryptographic hash calculators (SHA-256), UUID primitives, and pagination models.

## 3. Data Flow & Vertical Workflows

### 3.1 SBOM Ingestion & Component Extraction
1. Client (Web or CLI) uploads a CycloneDX or SPDX JSON document.
2. The infrastructure parser parses component trees, extracting Package URLs (purl), names, versions, licenses, and suppliers.
3. Entities are correlated with the organization's Project and specific Product Release.
4. A canonical SHA-256 hash is computed and stored for cryptographic verification.

### 3.2 Vulnerability Correlation & VEX Review
1. Scan results from tools like Trivy or OSV are uploaded or matched against the component inventory.
2. Findings are created linking CVE/GHSA identifiers to specific project releases and components.
3. Engineers or security reviewers create VEX statements defining exploitability status (`not_affected`, `affected`, `fixed`, `under_investigation`).
4. Every change to a VEX decision is immutably recorded in the decision audit history with author, justification code, and evidence rationale.

### 3.3 Evidence Package Assembly
1. Users trigger an Evidence Package export for a target Release.
2. The Evidence Service collects the release SBOM, all active VEX statements, scanner reports, and decision history.
3. A cryptographic `manifest.json` is generated containing the SHA-256 hash of each file in the package.
4. The service zips the bundle and serves it with tamper-evident checksums.
