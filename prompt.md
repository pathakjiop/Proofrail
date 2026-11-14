# MASTER PROJECT BUILD PROMPT
# VULNLEDGER — SOFTWARE SUPPLY-CHAIN SECURITY & EVIDENCE PLATFORM

## 1. YOUR ROLE

Act as a principal software architect, senior Rust engineer, senior frontend engineer, cybersecurity engineer, DevSecOps engineer, product designer, and technical product manager.

Your responsibility is to design, architect, implement, test, secure, and document an entire production-oriented software platform called **VulnLedger**.

Do not create just a landing page, UI mockup, clickable prototype, or demonstration dashboard.

Build the actual application with a working frontend, backend, database, CLI, integrations, security workflows, and deployment infrastructure.

Think like an engineering team building a globally distributed developer-infrastructure startup.

Work autonomously. Inspect the existing repository before making changes. Make sensible engineering decisions without repeatedly asking for approval. Maintain a `todo.md` file and update it as implementation progresses.

Do not claim that something is implemented unless it actually works.

---

# 2. PRODUCT VISION

VulnLedger is an open-core software supply-chain security and evidence management platform for small software companies, independent developers, startups, and engineering teams.

### The problem

Software companies depend on hundreds or thousands of external dependencies.

When a vulnerability is discovered, developers face several problems:

- They don't know which product releases contain the affected dependency.
- Security scanners generate too many alerts.
- They struggle to determine whether a vulnerability actually affects their software.
- VEX statements are difficult to create and maintain.
- SBOM files are scattered across repositories and releases.
- Security decisions are not properly documented.
- Evidence required for security reviews is spread across multiple tools.
- Small engineering teams cannot afford dedicated compliance departments.

### Our solution

Build one unified workspace that allows engineering teams to:

1. Generate and import Software Bills of Materials (SBOMs).
2. Identify vulnerabilities in software components.
3. Map vulnerable dependencies to specific products and releases.
4. Investigate vulnerability exploitability.
5. Create, review, approve, and export VEX statements.
6. Track remediation and security decisions.
7. Maintain an auditable security evidence history.
8. Generate downloadable release evidence packages.
9. Monitor repositories through developer tools and CI/CD.
10. Organize technical evidence for CRA-related security preparation.

### Product positioning

We are NOT building another vulnerability scanner.

We are building the **security decision, evidence, and workflow management layer** that works with existing open-source security tools.

Our product should complement tools such as:

- Trivy
- Syft
- OSV-Scanner
- Grype
- Dependency-Track
- OpenVEX
- CycloneDX
- SPDX

Never unnecessarily recreate functionality already provided by mature open-source projects.

---

# 3. NON-NEGOTIABLE FOUNDER CONSTRAINTS

## Initial investment: $0–$50 USD MAXIMUM

My total initial personal investment must never exceed $50.

This is a strict constraint, not a suggested budget.

Requirements:

- Prefer free and open-source software.
- Use free development tools.
- Use free hosting tiers where available and appropriate.
- Use local development infrastructure.
- Avoid paid APIs.
- Avoid paid AI services.
- Avoid expensive managed databases.
- Avoid expensive observability services.
- Avoid paid authentication providers where a secure alternative is feasible.
- Do not require paid datasets.
- Do not require expensive cloud GPUs.
- Do not introduce subscriptions without necessity.
- Never purchase services or incur costs without explicit approval.

Before recommending a hosting platform or third-party service, verify its current free-tier limitations.

Provide a fully functional local Docker-based deployment.

The application must not stop working because a free-tier service is unavailable.

Prefer self-hostable services and portable deployments.

---

# 4. GLOBAL MARKET REQUIREMENTS

VulnLedger must be designed for international customers from day one.

Target customers:

- Independent developers.
- Small software companies.
- Developer-tool startups.
- SaaS businesses.
- Open-source maintainers.
- Software vendors.
- Security consultants.
- Engineering teams.
- Companies selling software in regulated markets.

Target geographical markets:

- United States.
- European Union.
- United Kingdom.
- India.
- Canada.
- Australia.
- Other international software markets.

Requirements:

- English-first interface.
- International date and time handling.
- UTC timestamps internally.
- Currency-ready pricing configuration.
- Global API accessibility.
- International customer onboarding.
- Privacy-conscious architecture.
- Clear data ownership.
- No dependency on one country.
- Localization-ready interface.

Do not make unsupported claims about legal compliance.

Implement CRA-related readiness workflows as technical evidence management, not as automatic legal certification.

Verify regulatory requirements from official sources before implementing regulatory checklists. Distinguish manufacturers, distributors, importers, products, and other relevant regulatory roles.

---

# 5. VISUAL DESIGN — FOLLOW THE ATTACHED DOCK SCREENSHOT

The attached screenshot is the primary design reference.

Recreate its design philosophy and layout, not its branding or product content.

The interface must look like a premium, clean, professional developer workspace.

## Design principles

- White background.
- Minimal interface.
- Thin borders.
- Compact navigation.
- Generous whitespace.
- Small, readable typography.
- Neutral gray secondary elements.
- Restrained blue primary actions.
- Minimal shadows.
- Small border radii.
- Consistent alignment.
- Professional information density.
- Fast and responsive interactions.

Suggested design tokens:

```css
:root {
  --background: #ffffff;
  --foreground: #111827;
  --sidebar: #ffffff;
  --surface-secondary: #f7f8fa;
  --border: #e5e7eb;
  --muted: #6b7280;
  --primary: #1677ff;
  --primary-hover: #0958d9;
  --success: #16a34a;
  --warning: #d97706;
  --danger: #dc2626;
}
```

Use a clean sans-serif typeface.

Do not introduce:

- Excessive gradients.
- Glassmorphism.
- Huge rounded cards.
- Oversized dashboard statistics.
- Unnecessary animations.
- Decorative emojis as icons.
- Generic AI-generated dashboard patterns.
- Excessive colors.
- Excessive shadows.
- Giant headings.
- Unnecessary hero sections inside the application.

Use small, consistent Lucide icons.

## Three-column layout

Reproduce the structural design of the reference.

### Column 1: Primary navigation

Approximately 176px wide on desktop.

Top section:
- VulnLedger logo.
- Workspace selector.

Navigation:
- Overview
- Projects
- Vulnerabilities
- SBOM Inventory
- VEX Statements
- Evidence Center
- Integrations
- Learning / Documentation
- Administration
- Settings

Bottom section:
- User avatar.
- User name.
- Organization.
- Help and account actions.

The selected navigation item should have a subtle light-gray background.

### Column 2: Contextual sidebar

Approximately 156px wide on desktop.

This panel must adapt to the selected section.

For Overview:
- Search.
- Recent projects.
- Recent scans.
- Saved views.
- Quick actions.

For Projects:
- Search projects.
- Repository list.
- Recent releases.

For Vulnerabilities:
- Search findings.
- Saved filters.
- Severity categories.

For VEX:
- Create statement.
- Search statements.
- Recent decisions.
- Pending reviews.

For Evidence:
- Evidence packages.
- Recent exports.
- Release history.

### Column 3: Main workspace

Use the remaining available width.

Top header:
- Current section title.
- Breadcrumbs.
- Contextual actions.
- Settings.
- Profile.

Main content:
- Spacious, centered content.
- Maximum readable content width.
- Tables where data needs comparison.
- Simple forms.
- Inline status indicators.
- Clean activity history.
- Contextual panels.
- Responsive empty states.

Do not force every screen into the same card-based dashboard.

Adapt the content to the task.

### Responsive behavior

Desktop:
- Full three-column interface.

Tablet:
- Collapsible contextual sidebar.
- Compact primary navigation.

Mobile:
- Collapsible navigation.
- Single-column content.
- Touch-friendly actions.
- Scrollable tables or appropriate mobile alternatives.

The interface should remain visually consistent across screen sizes.

---

# 6. APPLICATION MODULES

Build the following modules as real, integrated product features.

## MODULE A — Overview

Create an overview of the organization's software security posture.

Display:

- Total projects.
- Total software components.
- Open vulnerabilities.
- Critical vulnerabilities.
- High-severity vulnerabilities.
- Pending VEX decisions.
- Recently generated SBOMs.
- Security evidence coverage.
- Recent activity.
- Upcoming security review tasks.

Include:
- Recently scanned repositories.
- Projects requiring attention.
- Unreviewed findings.
- Recent remediation.
- Quick navigation to key workflows.

All statistics must come from the backend, not hardcoded values.

## MODULE B — Projects and repositories

Allow users to create and manage software projects.

A project should support:

- Project name.
- Description.
- Owner.
- Repository URL.
- Repository type.
- Default branch.
- Product identifier.
- Product version.
- Release history.
- Related SBOMs.
- Related vulnerabilities.
- Related VEX statements.
- Evidence packages.

Provide project-specific security dashboards.

Support multiple products per organization.

## MODULE C — SBOM Inventory

SBOM means Software Bill of Materials.

Support:

- CycloneDX.
- SPDX.
- JSON.
- XML where supported by the relevant format.

Features:

- Upload an SBOM.
- Validate the format.
- Parse dependencies.
- Extract package names.
- Extract package versions.
- Extract Package URLs (PURLs).
- Track suppliers and licenses where available.
- Associate SBOMs with products and releases.
- Compare SBOM versions.
- Detect component additions and removals.
- Maintain SBOM history.
- Download original SBOMs.
- Generate component reports.

Use Syft or equivalent mature tooling for SBOM generation.

Do not implement custom package inventory scanners unnecessarily.

## MODULE D — Vulnerability Management

Create a central vulnerability management system.

Features:

- Import scan results.
- Identify CVE records.
- Support OSV identifiers where applicable.
- Display severity.
- Display CVSS information where available.
- Show affected package.
- Show package version.
- Show advisory references.
- Associate findings with projects.
- Associate findings with releases.
- Track remediation status.
- Track first-seen and last-seen timestamps.
- Detect duplicate findings.
- Filter and search findings.

Severity categories:

- Critical.
- High.
- Medium.
- Low.
- Unknown.

Create detailed vulnerability pages.

A detailed finding should show:

- Vulnerability identifier.
- Description.
- Affected component.
- Affected product versions.
- Detection source.
- Severity.
- Technical references.
- Relevant remediation information.
- Related VEX statements.
- History of decisions.

Integrate mature scanners instead of developing a new vulnerability database.

## MODULE E — VEX Management

This is one of the most important modules.

VEX stands for Vulnerability Exploitability eXchange.

Build a complete workflow for creating and managing vulnerability statements.

Support these statuses where applicable to the selected VEX format:

- Not affected.
- Affected.
- Fixed.
- Under investigation.

Features:

1. Create a VEX statement.
2. Select a vulnerability.
3. Select a product.
4. Select an affected product version or release.
5. Select the VEX status.
6. Add technical justification.
7. Attach supporting evidence.
8. Record the author.
9. Record timestamps.
10. Review and approve decisions.
11. Maintain decision history.
12. Reopen and update decisions.
13. Export valid VEX documents.
14. Validate VEX documents before export.

Justifications must follow the actual supported vocabulary of the selected standard.

Never automatically mark a vulnerability as not affected just because a scanner cannot confirm exploitation.

Require sufficient technical evidence for a defensible decision.

The VEX editor should be simple enough for an ordinary software engineer to use.

## MODULE F — Evidence Center

Create a centralized evidence management system.

Evidence types:

- SBOM documents.
- VEX statements.
- Vulnerability scan reports.
- Remediation records.
- Product release metadata.
- Build information.
- Security review records.
- Technical justifications.
- Disclosure policies.
- Support-period documentation.

Create downloadable evidence packages.

Each evidence package should include:

- Product identifier.
- Product version.
- Associated SBOM.
- Associated VEX statements.
- Relevant vulnerability results.
- Remediation history.
- Evidence metadata.
- Generation timestamp.
- SHA-256 hashes.
- Package manifest.

Export as ZIP with a documented structure.

Preserve original source artifacts.

Do not describe an evidence package as a legal compliance certificate.

## MODULE G — CRA Readiness Workspace

Create an optional regulatory readiness module.

Its purpose is to organize technical evidence relevant to the EU Cyber Resilience Act.

Features:

- Product classification notes.
- Manufacturer information.
- Vulnerability handling workflow.
- Security support documentation.
- Vulnerability reporting preparation.
- SBOM inventory visibility.
- VEX history.
- Technical documentation tracking.
- Evidence completeness checklist.
- Release security history.

Provide links to official regulatory sources.

Make the checklist configurable because applicability depends on product characteristics and the company's regulatory role.

Never claim that completing the checklist guarantees CRA compliance.

## MODULE H — Integrations

Create an integrations workspace.

Prioritize:

- GitHub.
- GitHub Actions.
- Syft.
- Trivy.
- OSV-Scanner.
- Grype.
- OpenVEX.
- CycloneDX.
- SPDX.

Implement integrations progressively.

Initial workflow:

1. Developer uses the VulnLedger CLI.
2. CLI generates or collects SBOM and vulnerability results.
3. CLI validates outputs.
4. Developer uploads results to VulnLedger.
5. Platform correlates results with a project and release.
6. Dashboard updates.
7. Engineer reviews VEX decisions.

Later, add automated GitHub repository connections and webhooks.

Never require a GitHub connection just to use local SBOM and VEX functionality.

---

# 7. RUST CLI — VULNLEDGER DEVELOPER TOOL

Build a separate Rust-based command-line application.

The CLI is a major part of the open-source product.

Its purpose is to make VulnLedger useful directly from a developer's terminal and CI/CD pipeline.

Possible commands:

```bash
vulnledger --help

vulnledger init

vulnledger sbom generate

vulnledger sbom validate

vulnledger scan

vulnledger vex create

vulnledger vex validate

vulnledger vex export

vulnledger project list

vulnledger push

vulnledger evidence export

vulnledger doctor
```

The exact commands should follow a consistent CLI design.

Requirements:

- Rust.
- Clap for command-line argument parsing.
- Serde for serialization.
- Reqwest for API communication.
- Structured logging.
- Good error messages.
- Machine-readable JSON output.
- Appropriate nonzero exit codes.
- Configuration file support.
- Environment variable support.
- Secure credential storage guidance.
- Cross-platform support: Windows, Linux, macOS.

The CLI should detect whether external scanner binaries are installed.

Provide clear installation instructions rather than silently failing.

Support local usage without requiring a cloud account.

The CLI must be useful independently of the paid platform.

---

# 8. OPEN-CORE PRODUCT STRATEGY

VulnLedger must have a genuine open-source foundation.

Do not create an artificially restricted free edition.

## Community edition — Free

Prioritize:

- Rust CLI.
- Local SBOM generation and validation.
- Local vulnerability scanning integration.
- VEX creation and validation.
- VEX export.
- Basic local evidence generation.
- Self-hosted basic deployment.
- Public documentation.

## Team edition — Paid SaaS

Potential capabilities:

- Hosted dashboard.
- Multiple users.
- Centralized projects.
- Repository monitoring.
- Collaborative VEX reviews.
- Advanced evidence history.
- Team permissions.
- Release comparisons.
- Automated workflows.

## Enterprise edition

Potential capabilities:

- Private deployment.
- Advanced RBAC.
- SSO.
- Advanced audit retention.
- Policy management.
- Enterprise integrations.
- Organizational reporting.
- Deployment configuration controls.

Initial pricing hypotheses to validate:

- Community: $0.
- Team: $19–$29/month.
- Enterprise: Custom pricing.

Do not implement complicated payments before validating paying customers.

Make pricing configurable so it can change without rewriting application code.

Clearly document which features are open source and which are proprietary.

---

# 9. TECHNICAL ARCHITECTURE

Choose a maintainable, production-oriented stack.

## Frontend

- React.
- TypeScript.
- Vite.
- CSS variables and modular CSS.
- React Router.
- TanStack Query.
- Lucide icons.
- Accessible component primitives.

The UI must follow the attached screenshot.

Do not sacrifice visual quality for speed.

Build reusable layout components and consistent patterns.

## Backend

Use Rust with:

- Axum.
- Tokio.
- SQLx.
- Serde.
- Tracing.
- Tower middleware.
- OpenAPI documentation.

Use a modular architecture with clearly separated domain, application, infrastructure, and API layers.

Do not introduce excessive abstractions.

## Database

PostgreSQL.

Use SQL migrations and version-controlled schema changes.

Main entities:

- Users.
- Organizations.
- Organization memberships.
- Projects.
- Repositories.
- Releases.
- SBOM documents.
- Components.
- Vulnerabilities.
- Findings.
- VEX statements.
- Evidence artifacts.
- Evidence packages.
- Scan jobs.
- Integrations.
- Audit events.

Implement appropriate foreign keys, unique constraints, indexes, and transactions.

Enforce organization-level data isolation.

## Background processing

Start with PostgreSQL-backed job processing using safe transactional job claiming.

Do not introduce RabbitMQ, Kafka, or Redis unless a demonstrated workload requires them.

Jobs may include:

- SBOM processing.
- Vulnerability scan ingestion.
- Artifact validation.
- Evidence package generation.
- GitHub webhook processing.

## Storage

Support:

- Local filesystem storage for development and self-hosting.
- An abstraction for S3-compatible storage in hosted deployments.

Do not tie the application to a single storage provider.

---

# 10. PROPOSED MONOREPO STRUCTURE

Build the project in a clean monorepo.

Start with this structure and refine only when engineering requirements justify it:

```text
vulnledger/
│
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── layouts/
│   │   │   ├── pages/
│   │   │   ├── features/
│   │   │   │   ├── overview/
│   │   │   │   ├── projects/
│   │   │   │   ├── sbom/
│   │   │   │   ├── vulnerabilities/
│   │   │   │   ├── vex/
│   │   │   │   ├── evidence/
│   │   │   │   ├── compliance/
│   │   │   │   ├── integrations/
│   │   │   │   └── settings/
│   │   │   ├── hooks/
│   │   │   ├── lib/
│   │   │   ├── styles/
│   │   │   └── types/
│   │   └── tests/
│   │
│   ├── api/
│   │
│   ├── worker/
│   │
│   └── cli/
│
├── crates/
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── shared/
│
├── migrations/
│
├── deploy/
│   ├── docker/
│   ├── scripts/
│   └── self-hosted/
│
├── docs/
│   ├── architecture.md
│   ├── api.md
│   ├── security.md
│   ├── threat-model.md
│   ├── self-hosting.md
│   ├── cli.md
│   ├── contributing.md
│   └── product-roadmap.md
│
├── scripts/
│
├── tests/
│
├── docker-compose.yml
├── .env.example
├── .gitignore
├── README.md
├── CONTRIBUTING.md
├── LICENSE
├── todo.md
└── Cargo.toml
```

Use the exact structure only where it is justified. Avoid creating empty folders or unnecessary packages.

---

# 11. AUTHENTICATION AND SECURITY

Security is not an optional feature in a security product.

Implement:

- Secure authentication.
- Argon2 password hashing where passwords are used.
- Secure session handling.
- CSRF protection where applicable.
- HTTP-only secure cookies.
- RBAC.
- Organization-level authorization.
- Resource ownership validation.
- Rate limiting.
- Input validation.
- File size limits.
- File format validation.
- Safe artifact processing.
- Secret management through environment configuration.
- Audit trails.
- Secure API error handling.
- Dependency vulnerability checks.

Never expose another organization's records through an insecure API query.

Never trust a client-supplied organization ID without verifying membership and authorization.

Protect uploaded artifacts against:

- Malformed files.
- Oversized inputs.
- Path traversal.
- Archive extraction attacks.
- Malicious filenames.
- Unsafe file processing.

Do not execute uploaded scripts or binaries.

Never store access tokens or passwords in plain text.

Do not log sensitive credentials.

Provide a practical threat model.

---

# 12. MULTI-TENANCY AND PERMISSIONS

Design the application to support multiple companies.

Organization roles:

- Owner.
- Admin.
- Developer.
- Security reviewer.
- Read-only member.

Permissions should be enforced on the backend.

Users must only access resources belonging to their organization and permitted projects.

Self-hosted single-organization mode should also be supported without unnecessary complexity.

---

# 13. API DESIGN

Create versioned APIs under:

```text
/api/v1/
```

Suggested resource groups:

```text
/auth
/users
/organizations
/members
/projects
/repositories
/releases
/sboms
/components
/vulnerabilities
/findings
/vex
/evidence
/scans
/integrations
/audit-events
```

Requirements:

- Consistent REST conventions.
- Pagination.
- Filtering.
- Sorting.
- Input validation.
- Predictable error responses.
- Request IDs.
- Proper authorization.
- OpenAPI documentation.
- API versioning.
- Idempotency for important ingestion operations.

Do not expose internal database implementation details through API responses.

---

# 14. TESTING AND ENGINEERING QUALITY

Build a testable application, not merely code that compiles.

Backend:

- Domain unit tests.
- API integration tests.
- Database tests.
- Authorization tests.
- Tenant-isolation tests.
- File validation tests.
- VEX serialization and validation tests.
- SBOM parsing tests.

Frontend:

- Component tests.
- Form validation tests.
- Navigation tests.
- API error state tests.
- Accessibility tests.

End-to-end:

- Create account.
- Create organization.
- Create project.
- Import SBOM.
- Process scan result.
- Review vulnerability.
- Create VEX statement.
- Export evidence package.

CLI:

- Unit tests.
- Command tests.
- Invalid input tests.
- Cross-platform build checks.

Add GitHub Actions CI for:

- Formatting.
- Linting.
- Tests.
- Build verification.
- Dependency checks.

Never mark a test as passed without actually running it.

---

# 15. USER EXPERIENCE REQUIREMENTS

The entire product must feel like a mature professional developer tool.

Every important workflow must include:

- Loading states.
- Empty states.
- Success feedback.
- Error feedback.
- Validation errors.
- Confirmation for destructive operations.
- Search.
- Useful filtering.
- Keyboard accessibility.
- Responsive layouts.

Do not leave buttons decorative or nonfunctional.

Do not use hardcoded demo information in production flows.

Use seed data only in a clearly identified development/demo environment.

The user should be able to move from repository to vulnerability to VEX decision to evidence package without losing context.

Maintain stable navigation and contextual relationships throughout the application.

---

# 16. DEPLOYMENT AND SELF-HOSTING

Provide a working local deployment.

Use Docker Compose for:

- PostgreSQL.
- API.
- Worker.
- Web frontend.
- Required supporting services only.

Provide:

- Database migrations.
- Seed script.
- Health checks.
- Persistent volumes.
- Environment configuration.
- Restart policies.
- Backup instructions.
- Upgrade instructions.
- Troubleshooting documentation.

A developer must be able to clone the project, configure the environment, and run it using documented commands.

Provide a self-hosted deployment configuration.

Hosted SaaS deployment must remain portable and not depend on one cloud vendor.

Before selecting a free hosting provider, verify current pricing and restrictions.

---

# 17. PERFORMANCE AND RELIABILITY

Priorities:

- Efficient database queries.
- Pagination for large records.
- Background processing for expensive tasks.
- Streaming for large artifact uploads where appropriate.
- Avoid unnecessary frontend re-rendering.
- Efficient component rendering.
- Proper database connection pooling.
- Bounded job concurrency.
- Safe retry logic.
- Idempotent ingestion.
- Clear operational logging.

Never accept a security evidence upload and silently lose it.

Use transactions and reliable job state transitions.

Provide understandable failure states and retry mechanisms.

---

# 18. PRODUCT DIFFERENTIATION

Do not compete by rebuilding all existing scanners.

Focus engineering effort on these differentiators:

1. The easiest VEX workflow for small engineering teams.
2. Product-version-specific vulnerability decisions.
3. A traceable history of security decisions.
4. A unified security evidence package.
5. A developer-friendly Rust CLI.
6. Simple self-hosted deployment.
7. Seamless integration with existing scanners.
8. Lightweight, understandable security workflows.
9. Affordable team collaboration.
10. A clean professional interface.

The platform must make complex security evidence understandable to ordinary software developers.

---

# 19. IMPLEMENTATION PHASES

Do not attempt to build everything in one unstructured coding pass.

Implement vertical slices, ensuring each phase works before expanding.

## PHASE 0 — Project foundation

- Inspect repository.
- Establish project architecture.
- Create monorepo.
- Configure Rust workspace.
- Configure frontend.
- Configure PostgreSQL.
- Create Docker Compose.
- Create environment configuration.
- Create documentation structure.
- Create `todo.md`.

Deliverable: A functioning development environment.

## PHASE 1 — UI foundation

Build the full design system based on the attached Dock screenshot.

Implement:

- Primary sidebar.
- Contextual sidebar.
- Main workspace.
- Responsive behavior.
- Navigation.
- Header.
- Buttons.
- Forms.
- Tables.
- Status indicators.
- Empty states.
- Loading states.

Build all major page layouts using clearly labeled seed data.

Deliverable: A complete navigable frontend.

## PHASE 2 — Backend foundation

Implement:

- Database schema.
- Migrations.
- Authentication.
- Organization management.
- Authorization.
- Project management.
- API structure.
- Logging.
- Health checks.

Deliverable: Working frontend connected to a real backend.

## PHASE 3 — SBOM

Implement:

- SBOM upload.
- Format validation.
- CycloneDX parsing.
- SPDX parsing.
- Component extraction.
- Product associations.
- Release associations.
- SBOM history.
- CLI generation and validation.

Deliverable: Actual SBOM processing.

## PHASE 4 — Vulnerability management

Implement:

- Scanner result ingestion.
- Vulnerability records.
- Finding associations.
- Severity management.
- Filtering.
- Search.
- Remediation status.
- Project-specific findings.

Deliverable: Working vulnerability management.

## PHASE 5 — VEX engine

Implement:

- VEX creation.
- VEX validation.
- Product/version association.
- Technical justification.
- Review workflow.
- Decision history.
- Export.
- CLI integration.

Deliverable: Working VEX management.

## PHASE 6 — Evidence center

Implement:

- Evidence artifact storage.
- Evidence manifests.
- SHA-256 checksums.
- ZIP generation.
- Release-based evidence packages.
- Export and download.
- Historical records.

Deliverable: Real evidence generation.

## PHASE 7 — GitHub and CI/CD

Implement progressively:

- GitHub authentication/integration.
- Repository connections.
- Webhook validation.
- GitHub Actions workflow examples.
- Automated SBOM ingestion.
- Release monitoring.
- Scan status reporting.

Deliverable: Working developer workflow.

## PHASE 8 — CRA readiness

Implement:

- Configurable product readiness checklist.
- Regulatory references.
- Evidence linking.
- Support documentation.
- Vulnerability handling records.
- Reporting preparation.
- Clear disclaimers.

Deliverable: Technical readiness workspace.

## PHASE 9 — Open-core packaging

Implement:

- Community CLI release.
- Open-source documentation.
- Contribution guide.
- Self-hosted deployment.
- Feature boundaries.
- Team edition architecture.
- Enterprise configuration.

Deliverable: Distributable product foundation.

## PHASE 10 — Production hardening

Implement:

- Security review.
- Threat-model review.
- Error handling.
- Performance testing.
- Backup and restore testing.
- Authorization testing.
- End-to-end testing.
- Build and deployment verification.

Deliverable: A production-oriented release candidate.

---

# 20. REQUIRED PROJECT DOCUMENTATION

Maintain the following documents:

### README.md

Explain the product, problem, features, architecture, setup, and usage.

### architecture.md

Explain system components, boundaries, data flows, and technical decisions.

### security.md

Document application security, authentication, authorization, secure storage, and secure development practices.

### threat-model.md

Document threats, attack surfaces, risks, mitigations, and residual risks.

### implementation.md

Document implementation choices, completed modules, and technical constraints.

### todo.md

Maintain an actionable task list with:

- Not started.
- In progress.
- Completed.
- Blocked.

Never mark incomplete functionality as completed.

### roadmap.md

Document future capabilities and milestones.

### self-hosting.md

Explain deployment, upgrades, backups, configuration, and troubleshooting.

### contributing.md

Explain how open-source contributors can participate.

---

# 21. DEVELOPMENT RULES

1. Inspect the repository before changing anything.
2. Never destroy existing working functionality without justification.
3. Prefer simple, maintainable architecture.
4. Avoid unnecessary dependencies.
5. Never duplicate existing open-source scanner functionality.
6. Never put secrets in source code.
7. Never use hardcoded production data.
8. Never create fake working integrations.
9. Never claim successful execution without test evidence.
10. Keep API contracts documented.
11. Use database migrations for schema changes.
12. Keep the frontend responsive.
13. Ensure every important interaction is functional.
14. Do not implement expensive infrastructure before customer demand justifies it.
15. Ask for approval before exceeding the $50 budget.
16. Prioritize working product features over decorative UI.
17. Keep the implementation aligned with the product vision.
18. Verify standards against their authoritative specifications.
19. Avoid overengineering for hypothetical millions of users.
20. Make reasonable trade-offs for a solo founder.

If a requirement is too large for one implementation pass, complete the most valuable functioning vertical slice first and document the remaining work.

---

# 22. SUCCESS CRITERIA

The project is not complete merely because the frontend looks good.

A successful initial product must allow a developer to:

1. Run VulnLedger locally.
2. Create an account or initialize a self-hosted workspace.
3. Create a software project.
4. Generate or upload an SBOM.
5. View its components.
6. Import or produce vulnerability findings.
7. Associate findings with releases.
8. Create and validate a VEX statement.
9. Maintain its decision history.
10. Generate and download an evidence package.
11. Use the Rust CLI independently.
12. Run the project through documented Docker Compose commands.

A successful hosted architecture must also support secure organizational isolation and collaboration.

---

# 23. YOUR FIRST EXECUTION TASK

Start immediately.

First:

1. Inspect the existing repository and its technology.
2. Identify any existing implementation that should be preserved.
3. Create the architecture and implementation plan.
4. Create the monorepo structure.
5. Create `todo.md`.
6. Establish a functioning local environment.
7. Build the UI foundation according to the attached screenshot.
8. Implement the first complete backend-to-frontend vertical workflow.

Do not spend the entire development cycle writing plans.

Start implementing actual software.

After every phase:

- Run relevant tests.
- Fix errors.
- Update documentation.
- Update `todo.md`.
- Verify the user-facing workflow.
- Summarize what actually works and what remains.

## FINAL PRODUCT PRINCIPLE

Build VulnLedger as a serious, globally useful developer-infrastructure company.

It should be:

- Open-source friendly.
- Developer-first.
- Security-first.
- Self-hostable.
- Affordable.
- Globally accessible.
- Technically defensible.
- Simple to adopt.
- Difficult to replace because of its workflow, integrations, and accumulated evidence history.

Do not build a generic SaaS dashboard.

Build a product that engineering teams genuinely depend on to understand vulnerabilities, make security decisions, and maintain trustworthy software release evidence.

**The objective is to build a real business, acquire the first paying international customers, and develop a sustainable global software company with no more than $50 in initial personal investment.**