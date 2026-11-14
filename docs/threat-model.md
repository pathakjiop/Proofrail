# VulnLedger Threat Model (STRIDE Methodology)

## 1. System Scope & Assets
- **Primary Assets**: Proprietary SBOMs, unpublished zero-day/vulnerability assessments, internal VEX justifications, API tokens, user credentials.
- **Entry Points**: Public REST API (`/api/v1`), Web UI, CLI client, GitHub webhook receivers.

## 2. Threat Analysis (STRIDE)

| Threat Category | Potential Attack Vector | Mitigation in VulnLedger | Residual Risk / Operational Control |
|---|---|---|---|
| **Spoofing** | Forged user identity or forged webhook delivery | Strong Argon2 hashing, signed JWTs, HMAC-SHA256 signature verification for external webhooks. | Compromised developer credentials; enforce MFA where feasible. |
| **Tampering** | Modification of VEX statements or release evidence | Immutable decision history logs, SHA-256 manifests on evidence packages. | Database administrator unauthorized manual direct updates. |
| **Repudiation** | Denying who authored a "not affected" VEX statement | Explicit `author_id` and timestamps captured in audit log for every status transition. | Shared API keys used by teams; encourage personal API tokens. |
| **Information Disclosure** | Cross-tenant data leakage between organizations | Query-level `organization_id` scoping in repository layer; tenant boundary validation middleware. | Implementation bug in query filters (covered by tenant isolation tests). |
| **Denial of Service** | Uploading massive 1GB malformed XML/JSON SBOMs | Streaming chunk-size caps, strict parsing limits, payload size limits (e.g., 50MB max). | Memory exhaustion from concurrent parsers; handled via bounded task pools. |
| **Elevation of Privilege** | Developer promoting themselves to Owner or modifying VEX without approval | Server-side role checks on mutating endpoints; RBAC permission gates. | Flawed route middleware mapping; verified by automated integration tests. |
