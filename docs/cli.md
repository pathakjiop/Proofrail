# VulnLedger CLI (`vulnledger`) Reference

The `vulnledger` CLI is a high-performance Rust command-line tool designed for local developer terminals and CI/CD pipelines.

## Installation

### From Source
```bash
cargo install --path apps/cli
```

## CLI Configuration
Set environment variables or use a local `.vulnledger.toml`:
```bash
export VULNLEDGER_API_URL="http://localhost:8080/api/v1"
export VULNLEDGER_API_TOKEN="vlg_live_xxxx"
```

## Available Commands

### 1. Verification & Diagnostics
```bash
# Check if external scanners (Syft, Trivy, OSV-Scanner) are available
vulnledger doctor
```

### 2. SBOM Operations
```bash
# Validate CycloneDX or SPDX JSON format and print component summary
vulnledger sbom validate ./bom.json

# Upload an SBOM to a specific project and release
vulnledger sbom upload --project my-api --release v1.0.0 ./bom.json
```

### 3. Vulnerability Scanning & Ingestion
```bash
# Import scan results from Trivy or Grype
vulnledger scan import --project my-api --release v1.0.0 ./trivy-results.json
```

### 4. VEX Management
```bash
# Interactively create a VEX statement
vulnledger vex create --vuln CVE-2023-44487 --status not_affected --justification inline_mitigations_already_exist --notes "Mitigated by reverse proxy limits"

# Validate a VEX document against standard schema
vulnledger vex validate ./vex.json

# Export VEX statements for a release
vulnledger vex export --project my-api --release v1.0.0 --output ./release-vex.json
```

### 5. Evidence Package Export
```bash
# Download and verify the tamper-evident ZIP evidence package for a release
vulnledger evidence export --project my-api --release v1.0.0 --out ./evidence.zip
```
