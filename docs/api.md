# VulnLedger REST API Reference

All requests must be prefixed with `/api/v1`. Authentication is performed via `Authorization: Bearer <token>` or HTTP-only session cookie.

## Authentication & Identity
- `POST /auth/register`: Create initial user and primary organization.
- `POST /auth/login`: Authenticate and obtain session token.
- `GET  /auth/me`: Get active user profile and organizations.

## Organizations & Workspaces
- `GET  /organizations`: List user organizations.
- `GET  /organizations/:id`: Retrieve details of current organization.
- `GET  /organizations/:id/members`: List team members and assigned roles.

## Projects & Releases
- `GET    /projects`: List projects in active organization.
- `POST   /projects`: Create a new project.
- `GET    /projects/:id`: Get project detail with release counts and posture summary.
- `GET    /projects/:id/releases`: List releases for project.
- `POST   /projects/:id/releases`: Register a new release version (e.g. `v1.2.0`).

## SBOM Management
- `GET    /sboms`: List SBOM documents.
- `POST   /sboms/upload`: Upload CycloneDX or SPDX JSON document (multipart form or JSON).
- `GET    /sboms/:id`: Get SBOM metadata and parsed component statistics.
- `GET    /sboms/:id/components`: List extracted components (purl, license, supplier).
- `GET    /sboms/:id/download`: Download raw original SBOM artifact.

## Vulnerabilities & Findings
- `GET    /findings`: List vulnerability findings with filters (project, severity, status).
- `POST   /findings/import`: Ingest vulnerability scanner results (Trivy, Grype, OSV).
- `GET    /findings/:id`: Retrieve finding details and related VEX statements.

## VEX (Vulnerability Exploitability eXchange)
- `GET    /vex`: List VEX statements.
- `POST   /vex`: Create or update a VEX statement for a vulnerability + release.
- `GET    /vex/:id`: Get VEX statement and full decision audit trail.
- `POST   /vex/:id/review`: Approve, reject, or request revisions on a VEX decision.
- `GET    /vex/:id/export`: Export as OpenVEX or CycloneDX VEX JSON.

## Evidence Center
- `GET    /evidence/packages`: List generated release evidence packages.
- `POST   /evidence/packages`: Generate an evidence package for a given project release.
- `GET    /evidence/packages/:id/download`: Download complete ZIP evidence bundle.
- `GET    /evidence/packages/:id/manifest`: Retrieve cryptographic SHA-256 package manifest.

## System & Health
- `GET    /healthz`: System health status and database connectivity.
- `GET    /doctor`: Diagnostic checks for local storage, database, and scanner integrations.
