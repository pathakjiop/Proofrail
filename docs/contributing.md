# Contributing to VulnLedger

We welcome contributions from the developer and security communities! VulnLedger is an open-core project dedicated to making software supply chain security and evidence management accessible to engineering teams worldwide.

## Monorepo Layout
- `apps/web`: React + Vite + TypeScript frontend.
- `apps/api`: REST API gateway with Axum.
- `apps/cli`: CLI utility in Rust.
- `crates/`: Domain, application services, infrastructure, and shared types.

## Development Setup
1. Install Rust (`rustup default stable`)
2. Install Node.js 20+
3. Run tests across all workspace crates:
   ```bash
   cargo test
   ```
4. Run frontend tests and linting:
   ```bash
   cd apps/web && npm test
   ```

## Pull Request Guidelines
- Write unit tests for new features.
- Avoid external paid dependencies.
- Adhere to the minimalist, high-information-density UI guidelines.
