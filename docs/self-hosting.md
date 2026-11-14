# Self-Hosting Guide for VulnLedger

VulnLedger is designed to run self-hosted with zero vendor lock-in and minimal overhead.

## Quickstart with Docker Compose

1. Clone the repository:
   ```bash
   git clone https://github.com/vulnledger/vulnledger.git
   cd vulnledger
   ```

2. Copy the example configuration:
   ```bash
   cp .env.example .env
   ```

3. Launch services:
   ```bash
   docker compose up -d
   ```

4. Verify health:
   ```bash
   curl http://localhost:8080/healthz
   ```

5. Access the Web Workspace:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Running Locally Without Docker (Direct Binary Mode)

For development or single-machine setups:

1. **Prerequisites**:
   - Rust toolchain (`rustc`, `cargo`) 1.80+
   - Node.js 20+ & npm

2. **Backend**:
   ```bash
   cargo run -p vulnledger-api
   ```
   *Defaults to local SQLite/PostgreSQL as configured in `.env` or `DATABASE_URL`.*

3. **Frontend**:
   ```bash
   cd apps/web
   npm install
   npm run dev
   ```
   Open `http://localhost:5173`.

## Backups & Maintenance
- **Database**: Run `pg_dump -U vulnledger vulnledger > backup.sql` periodically.
- **Storage**: Back up the `storage/` directory (holds uploaded SBOMs, scan files, and exported ZIP evidence packages).
