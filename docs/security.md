# VulnLedger Security Architecture & Policies

## 1. Multi-Tenant Isolation
- **Organization Boundary Enforcement**: Every database query operating on tenant data is strictly scoped by `organization_id`.
- **Role-Based Access Control (RBAC)**: Supported roles per organization:
  - `Owner`: Organization settings, billing, member management, project deletion.
  - `Admin`: Project creation, integration configuration, team membership.
  - `Developer`: Upload SBOMs, import scans, draft VEX statements.
  - `SecurityReviewer`: Review, approve, and finalize VEX statements and release evidence.
  - `ReadOnly`: View-only access to inventory, findings, and evidence packages.

## 2. Authentication & Session Management
- **Password Storage**: Passwords are saved using Argon2id with salted parameters.
- **Session Tokens / JWT**: Signed with a minimum 256-bit secret key; transmitted in secure HTTP-only cookies in browsers, or via `Authorization: Bearer <token>` in API and CLI workflows.
- **CLI API Tokens**: High-entropy cryptographically random tokens bound to specific organization and role permissions.

## 3. Upload & Artifact Security
- **File Validation**: Strict validation of MIME types and JSON schemas prior to parsing.
- **Zip-Slip & Path Traversal Mitigations**: Archive extraction routines strictly canonicalize paths and prevent directory escapes.
- **Size Quotas**: Configurable file upload limits (default 50MB per SBOM/scan artifact) to prevent Denial of Service (DoS).
- **Execution Defense**: Uploaded files are strictly treated as data assets and are never executed as scripts or binaries.

## 4. Cryptographic Integrity
- Every SBOM, VEX statement, and Evidence bundle is fingerprinted using SHA-256 upon arrival.
- Evidence packages include signed or manifest-verified checksums preventing silent tampering.
