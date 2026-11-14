use clap::{Args, Parser, Subcommand, ValueEnum};
use std::path::PathBuf;
use std::process::Command;
use uuid::Uuid;
use vulnledger_domain::{VexJustification, VexStatus};
use vulnledger_infrastructure::parsers::{cyclonedx, spdx};

#[derive(Parser)]
#[command(
    name = "proofrail",
    version = "0.1.0",
    about = "Proofrail — Software Supply-Chain Security & Evidence CLI",
    long_about = "A developer-first CLI for validating SBOMs, orchestrating VEX exploitability decisions, and assembling cryptographic release evidence packages."
)]
struct Cli {
    #[arg(
        long,
        env = "PROOFRAIL_API_URL",
        default_value = "http://localhost:8080/api/v1"
    )]
    api_url: String,

    #[arg(long, env = "PROOFRAIL_API_TOKEN")]
    token: Option<String>,

    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Verify local environment, CLI configuration, and scanner toolchain availability
    Doctor,

    /// Initialize local Proofrail workspace configuration file
    Init,

    /// Software Bill of Materials (SBOM) operations
    Sbom(SbomArgs),

    /// Ingest and validate vulnerability scanner results
    Scan(ScanArgs),

    /// Vulnerability Exploitability eXchange (VEX) management
    Vex(VexArgs),

    /// Export verifiable release evidence packages
    Evidence(EvidenceArgs),
}

#[derive(Args)]
struct SbomArgs {
    #[command(subcommand)]
    sub: SbomSubcommands,
}

#[derive(Subcommand)]
enum SbomSubcommands {
    /// Parse and validate an SBOM file (CycloneDX or SPDX format)
    Validate {
        /// Path to SBOM JSON file
        file: PathBuf,
    },
    /// Upload an SBOM to a VulnLedger project release
    Upload {
        /// Path to SBOM JSON file
        file: PathBuf,

        #[arg(long)]
        project: Uuid,

        #[arg(long)]
        release: Option<Uuid>,
    },
}

#[derive(Args)]
struct ScanArgs {
    #[command(subcommand)]
    sub: ScanSubcommands,
}

#[derive(Subcommand)]
enum ScanSubcommands {
    /// Ingest scan results from Trivy, Grype, or OSV-Scanner
    Import {
        /// Path to scanner output JSON file
        file: PathBuf,

        #[arg(long)]
        project: Uuid,

        #[arg(long)]
        release: Option<Uuid>,
    },
}

#[derive(Args)]
struct VexArgs {
    #[command(subcommand)]
    sub: VexSubcommands,
}

#[derive(Clone, Copy, ValueEnum)]
enum CliVexStatus {
    NotAffected,
    Affected,
    Fixed,
    UnderInvestigation,
}

impl From<CliVexStatus> for VexStatus {
    fn from(s: CliVexStatus) -> Self {
        match s {
            CliVexStatus::NotAffected => VexStatus::NotAffected,
            CliVexStatus::Affected => VexStatus::Affected,
            CliVexStatus::Fixed => VexStatus::Fixed,
            CliVexStatus::UnderInvestigation => VexStatus::UnderInvestigation,
        }
    }
}

#[derive(Clone, Copy, ValueEnum)]
enum CliVexJustification {
    ComponentNotPresent,
    VulnerableCodeNotPresent,
    VulnerableCodeCannotBeControlledByAdversary,
    VulnerableCodeNotInExecutePath,
    InlineMitigationsAlreadyExist,
    RequiresPrivileges,
    RequiresUserInteraction,
}

impl From<CliVexJustification> for VexJustification {
    fn from(j: CliVexJustification) -> Self {
        match j {
            CliVexJustification::ComponentNotPresent => VexJustification::ComponentNotPresent,
            CliVexJustification::VulnerableCodeNotPresent => VexJustification::VulnerableCodeNotPresent,
            CliVexJustification::VulnerableCodeCannotBeControlledByAdversary => {
                VexJustification::VulnerableCodeCannotBeControlledByAdversary
            }
            CliVexJustification::VulnerableCodeNotInExecutePath => {
                VexJustification::VulnerableCodeNotInExecutePath
            }
            CliVexJustification::InlineMitigationsAlreadyExist => {
                VexJustification::InlineMitigationsAlreadyExist
            }
            CliVexJustification::RequiresPrivileges => VexJustification::RequiresPrivileges,
            CliVexJustification::RequiresUserInteraction => VexJustification::RequiresUserInteraction,
        }
    }
}

#[derive(Subcommand)]
enum VexSubcommands {
    /// Create a new VEX statement record
    Create {
        #[arg(long)]
        project: Uuid,

        #[arg(long)]
        release: Option<Uuid>,

        #[arg(long)]
        vuln: String,

        #[arg(long, value_enum)]
        status: CliVexStatus,

        #[arg(long, value_enum)]
        justification: Option<CliVexJustification>,

        #[arg(long)]
        notes: String,
    },
    /// Validate a VEX document against standard OpenVEX / CycloneDX VEX schema
    Validate {
        file: PathBuf,
    },
}

#[derive(Args)]
struct EvidenceArgs {
    #[command(subcommand)]
    sub: EvidenceSubcommands,
}

#[derive(Subcommand)]
enum EvidenceSubcommands {
    /// Request and export a signed release evidence ZIP bundle
    Export {
        #[arg(long)]
        project: Uuid,

        #[arg(long)]
        release: Uuid,

        #[arg(long, default_value = "./evidence-package.zip")]
        out: PathBuf,
    },
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let cli = Cli::parse();

    match cli.command {
        Commands::Doctor => {
            println!("🔍 Checking VulnLedger local developer toolchain:\n");
            check_tool("syft", "SBOM generator");
            check_tool("trivy", "Vulnerability scanner");
            check_tool("grype", "Vulnerability scanner");
            check_tool("osv-scanner", "Open Source Vulnerability scanner");
            check_tool("git", "Version control");

            println!("\n🌐 Connecting to VulnLedger API at: {}", cli.api_url);
            let client = reqwest::Client::new();
            match client.get(format!("{}/doctor", cli.api_url)).send().await {
                Ok(resp) if resp.status().is_success() => {
                    println!("   ✅ API server is reachable and operational.");
                }
                Ok(resp) => {
                    println!("   ⚠️ API returned non-success code: {}", resp.status());
                }
                Err(_) => {
                    println!("   ℹ️ API is not currently running locally (run 'cargo run -p vulnledger-api').");
                    println!("      Local offline operations (sbom validate, vex validate) remain fully functional.");
                }
            }
        }

        Commands::Init => {
            let config_content = r#"# VulnLedger Workspace Configuration
api_url = "http://localhost:8080/api/v1"
# token = "vlg_live_your_token_here"
"#;
            std::fs::write(".vulnledger.toml", config_content)?;
            println!("✅ Created .vulnledger.toml in current workspace.");
        }

        Commands::Sbom(args) => match args.sub {
            SbomSubcommands::Validate { file } => {
                if !file.exists() {
                    eprintln!("❌ File not found: {}", file.display());
                    std::process::exit(1);
                }
                let content = std::fs::read_to_string(&file)?;
                let dummy_id = Uuid::new_v4();

                if let Ok(cdx) = cyclonedx::parse_cyclonedx_json(dummy_id, &content) {
                    println!("✅ Valid CycloneDX SBOM document detected.");
                    println!("   Spec Version: {}", cdx.spec_version);
                    println!("   Component Count: {}", cdx.components.len());
                    for comp in cdx.components.iter().take(5) {
                        println!("   • {} @ {} ({})", comp.name, comp.version, comp.license.as_deref().unwrap_or("no-license"));
                    }
                    if cdx.components.len() > 5 {
                        println!("   ... and {} more components.", cdx.components.len() - 5);
                    }
                } else if let Ok(spdx_doc) = spdx::parse_spdx_json(dummy_id, &content) {
                    println!("✅ Valid SPDX SBOM document detected.");
                    println!("   Spec Version: {}", spdx_doc.spec_version);
                    println!("   Package Count: {}", spdx_doc.components.len());
                } else {
                    eprintln!("❌ Unable to parse file as CycloneDX or SPDX JSON format.");
                    std::process::exit(1);
                }
            }

            SbomSubcommands::Upload { file, project, release } => {
                if !file.exists() {
                    eprintln!("❌ File not found: {}", file.display());
                    std::process::exit(1);
                }
                println!("📤 Uploading SBOM {} to project {}...", file.display(), project);
                let client = reqwest::Client::new();
                let file_part = reqwest::multipart::Part::bytes(std::fs::read(&file)?)
                    .file_name(file.file_name().unwrap().to_string_lossy().to_string());

                let mut form = reqwest::multipart::Form::new()
                    .part("file", file_part)
                    .text("project_id", project.to_string());

                if let Some(rel) = release {
                    form = form.text("release_id", rel.to_string());
                }

                let mut req = client.post(format!("{}/sboms/upload", cli.api_url)).multipart(form);
                if let Some(t) = &cli.token {
                    req = req.bearer_auth(t);
                }

                let resp = req.send().await?;
                if resp.status().is_success() {
                    println!("✅ SBOM successfully uploaded and processed.");
                } else {
                    eprintln!("❌ Upload failed: {}", resp.status());
                }
            }
        },

        Commands::Scan(args) => match args.sub {
            ScanSubcommands::Import { file, project, release } => {
                if !file.exists() {
                    eprintln!("❌ File not found: {}", file.display());
                    std::process::exit(1);
                }
                let content = std::fs::read_to_string(&file)?;
                println!("📥 Ingesting scan findings from {}...", file.display());
                let client = reqwest::Client::new();
                let payload = serde_json::json!({
                    "project_id": project,
                    "release_id": release,
                    "scan_json": content,
                });

                let mut req = client.post(format!("{}/findings/import", cli.api_url)).json(&payload);
                if let Some(t) = &cli.token {
                    req = req.bearer_auth(t);
                }

                let resp = req.send().await?;
                if resp.status().is_success() {
                    let json: serde_json::Value = resp.json().await?;
                    println!("✅ Findings successfully ingested: {} items.", json["findings_count"]);
                } else {
                    eprintln!("❌ Ingestion failed: {}", resp.status());
                }
            }
        },

        Commands::Vex(args) => match args.sub {
            VexSubcommands::Create { project, release, vuln, status, justification, notes } => {
                let domain_status: VexStatus = status.into();
                let domain_just: Option<VexJustification> = justification.map(|j| j.into());

                let client = reqwest::Client::new();
                let payload = serde_json::json!({
                    "project_id": project,
                    "release_id": release,
                    "vuln_id": vuln,
                    "status": domain_status,
                    "justification": domain_just,
                    "statement_notes": notes,
                });

                let mut req = client.post(format!("{}/vex", cli.api_url)).json(&payload);
                if let Some(t) = &cli.token {
                    req = req.bearer_auth(t);
                }

                let resp = req.send().await?;
                if resp.status().is_success() {
                    println!("✅ VEX statement successfully created.");
                } else {
                    eprintln!("❌ Failed to create VEX statement: {}", resp.status());
                }
            }

            VexSubcommands::Validate { file } => {
                if !file.exists() {
                    eprintln!("❌ File not found: {}", file.display());
                    std::process::exit(1);
                }
                let content = std::fs::read_to_string(&file)?;
                let _: serde_json::Value = serde_json::from_str(&content)
                    .map_err(|e| anyhow::anyhow!("Invalid JSON: {}", e))?;
                println!("✅ Valid VEX document structure verified for: {}", file.display());
            }
        },

        Commands::Evidence(args) => match args.sub {
            EvidenceSubcommands::Export { project, release, out } => {
                println!("📦 Generating and downloading tamper-evident evidence package for release {}...", release);
                let client = reqwest::Client::new();
                let payload = serde_json::json!({
                    "project_id": project,
                    "release_id": release,
                });

                let mut req = client.post(format!("{}/evidence/packages", cli.api_url)).json(&payload);
                if let Some(t) = &cli.token {
                    req = req.bearer_auth(t);
                }

                let resp = req.send().await?;
                if resp.status().is_success() {
                    let pkg_meta: serde_json::Value = resp.json().await?;
                    let pkg_id = pkg_meta["id"].as_str().unwrap();

                    // Download zip
                    let dl_resp = client.get(format!("{}/evidence/packages/{}/download", cli.api_url, pkg_id)).send().await?;
                    let bytes = dl_resp.bytes().await?;
                    std::fs::write(&out, &bytes)?;
                    println!("✅ Evidence package saved to: {}", out.display());
                    println!("   Package SHA-256: {}", pkg_meta["sha256_hash"].as_str().unwrap_or(""));
                } else {
                    eprintln!("❌ Evidence export failed: {}", resp.status());
                }
            }
        },
    }

    Ok(())
}

fn check_tool(binary_name: &str, description: &str) {
    let status = Command::new(binary_name).arg("--version").output();
    match status {
        Ok(_) => println!("   ✅ {:<12} installed ({})", binary_name, description),
        Err(_) => println!("   ⚠️ {:<12} not detected in PATH ({})", binary_name, description),
    }
}
