# VulnLedger Product Roadmap

## Q1: Core Foundation & Open-Core CLI (Community Edition)
- [x] Three-column developer workspace UI
- [x] Rust workspace architecture with Axum API & domain crates
- [x] CycloneDX & SPDX SBOM parsing, component extraction, and storage
- [x] Ingestion for Trivy, Grype, and OSV scanner results
- [x] VEX statement creation, justification lifecycle, and CSAF/OpenVEX export
- [x] Tamper-evident Evidence Package generation with cryptographic SHA-256 manifests
- [x] Standalone `vulnledger` CLI for developer terminals and CI/CD

## Q2: Team Collaboration & CI/CD Integrations (Team Edition)
- [ ] Direct GitHub App & GitLab integration with automated PR checks
- [ ] Multi-user VEX peer-review approval gates
- [ ] Ephemeral preview release evidence validation
- [ ] Configurable notifications (Slack, Discord, Email webhooks)

## Q3: Regulatory Dossier & Enterprise Compliance (Enterprise Edition)
- [ ] Automated EU Cyber Resilience Act (CRA) technical documentation generator
- [ ] SAML 2.0 / OIDC Enterprise Single Sign-On (SSO)
- [ ] Role-based fine-grained project permissions and multi-team tenancy
- [ ] Continuous SBOM diffing and drift detection across semantic version tags
