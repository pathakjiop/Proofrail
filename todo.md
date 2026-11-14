# VulnLedger Implementation Tracker

## Phase 0: Project Foundation & Architecture
- [x] Inspect workspace and initialize Git repository
- [x] Configure `.gitignore` for Rust, Node, and environment files
- [x] Create project documentation structure (`docs/architecture.md`, `docs/security.md`, `docs/threat-model.md`, `docs/api.md`, `docs/self-hosting.md`, `docs/cli.md`, `docs/contributing.md`, `docs/product-roadmap.md`)
- [x] Setup Monorepo structure (`apps/web`, `apps/api`, `apps/cli`, `crates/domain`, `crates/application`, `crates/infrastructure`, `crates/shared`)
- [x] Setup root `Cargo.toml` with workspace configuration
- [x] Setup root `docker-compose.yml` and `.env.example`
- [x] Create comprehensive `README.md` and `LICENSE` (Apache-2.0)

## Phase 1: UI Foundation (Three-Column Workspace Layout)
- [x] Initialize React + Vite + TypeScript frontend in `apps/web`
- [x] Configure styling and design tokens adhering strictly to Section 5 design principles
- [x] Implement Three-Column Layout:
  - [x] Column 1: Primary Navigation (~176px, logo, workspace switcher, nav items, user profile)
  - [x] Column 2: Contextual Sidebar (~176px, context-sensitive to active module)
  - [x] Column 3: Main Workspace (top bar, breadcrumbs, search, content area)
- [x] Implement responsive behavior (desktop 3-column, tablet collapsible, mobile single-column)
- [x] Implement Core UI Components:
  - [x] Data tables with sorting, filtering, and responsive states
  - [x] Badge and status indicators (Critical, High, Medium, Low; VEX statuses)
  - [x] Modal dialogs with keyboard accessibility
  - [x] Forms with input validation and inline errors
- [x] Implement all major page views with mock and live data adapters:
  - [x] Overview Dashboard (`/`)
  - [x] Projects & Repositories (`/projects`)
  - [x] SBOM Inventory (`/sbom`)
  - [x] Vulnerability Management (`/vulnerabilities`)
  - [x] VEX Management (`/vex`)
  - [x] Evidence Center (`/evidence`)
  - [x] CRA Readiness Workspace (`/cra-readiness`)
  - [x] Integrations (`/integrations`)
  - [x] Documentation & Learning (`/docs`)
  - [x] Settings & Administration (`/settings`)

## Phase 2: Backend Architecture & Core API
- [x] Setup `crates/domain` with core entities:
  - [x] Organization, User, Membership, Role (RBAC)
  - [x] Project, Repository, Release
  - [x] SbomDocument, Component
  - [x] Vulnerability, Finding, Severity, RemediationStatus
  - [x] VexStatement, VexStatus, VexJustification, DecisionHistory
  - [x] EvidencePackage, EvidenceArtifact, Manifest
- [x] Setup `crates/shared` with error handling, UUIDs, timestamps, pagination, SHA-256 hashing
- [x] Setup `crates/infrastructure` with:
  - [x] Multi-tenant state repository store
  - [x] File storage service (local filesystem with path traversal protection)
- [x] Setup `crates/application` services (Auth, Project, SBOM, Vulnerability, VEX, Evidence)
- [x] Setup `apps/api` (Axum 0.8+ / Tokio REST API):
  - [x] Auth endpoints (`/api/v1/auth/*` - register, login, me)
  - [x] Projects endpoints (`/api/v1/projects/*`)
  - [x] SBOM endpoints (`/api/v1/sboms/*`)
  - [x] Vulnerability & Findings endpoints (`/api/v1/findings/*`)
  - [x] VEX endpoints (`/api/v1/vex/*`)
  - [x] Evidence package endpoints (`/api/v1/evidence/*`)
  - [x] Health & Diagnostics endpoints (`/healthz`, `/api/v1/doctor`)

## Phase 3: SBOM Engine (CycloneDX & SPDX Parsing & Validation)
- [x] Implement CycloneDX JSON parser and validator
- [x] Implement SPDX 2.3+ JSON parser and validator
- [x] Component extraction: PURL, supplier, license, version
- [x] Association with Projects and Releases
- [x] Cryptographic SHA-256 fingerprinting

## Phase 4: Vulnerability & Ingestion Engine
- [x] Ingestion of Trivy and OSV scanner JSON reports
- [x] Deduplication and correlation of CVE findings to SBOM components
- [x] Severity scoring (CVSS v3 mapping)
- [x] Finding lifecycle tracking (open, under review, mitigated, resolved)

## Phase 5: VEX Decision & Exploitability Engine
- [x] VEX Statement creation workflow
- [x] Standard status vocabulary: `not_affected`, `affected`, `fixed`, `under_investigation`
- [x] Justification criteria mapping (e.g. `inline_mitigations_already_exist`, `vulnerable_code_cannot_be_controlled_by_adversary`, `component_not_present`)
- [x] Audit trail and decision history
- [x] OpenVEX JSON export format

## Phase 6: Evidence Center & Cryptographic Manifests
- [x] Evidence bundle assembler:
  - [x] SBOM + VEX + Scan reports
  - [x] SHA-256 checksum generation for every artifact
  - [x] Cryptographic Manifest (`manifest.json`)
  - [x] Portable ZIP package generation
- [x] Downloadable release evidence packages

## Phase 7: Rust Developer CLI (`vulnledger`)
- [x] Implement `vulnledger` CLI binary in `apps/cli` with `clap`
- [x] Commands:
  - [x] `vulnledger doctor` - verify external tool chains and API connectivity
  - [x] `vulnledger init` - initialize local config
  - [x] `vulnledger sbom validate <file>`
  - [x] `vulnledger sbom upload`
  - [x] `vulnledger scan import <file>`
  - [x] `vulnledger vex create` & `vulnledger vex validate <file>`
  - [x] `vulnledger evidence export`

## Phase 8: CRA Readiness & Regulatory Workspace
- [x] EU Cyber Resilience Act technical evidence checklist
- [x] Technical controls mapping (CVD, SBOM transparency, support period)
- [x] Technical readiness dossier progress calculation

## Phase 9: Verification, Tests & Build Validation
- [x] Rust workspace unit and integration tests passing (`cargo test --workspace`)
- [x] Frontend TypeScript compilation and production bundle build passing (`npm run build`)
- [x] CLI binary verified against sample CycloneDX SBOM
