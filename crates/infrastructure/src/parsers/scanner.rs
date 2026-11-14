use vulnledger_domain::{RemediationStatus, Severity, VulnerabilityFinding};
use vulnledger_shared::{new_id, now_utc, AppError, Result};
use serde_json::Value;
use uuid::Uuid;

pub fn parse_scan_report(
    organization_id: Uuid,
    project_id: Uuid,
    release_id: Option<Uuid>,
    json_str: &str,
) -> Result<Vec<VulnerabilityFinding>> {
    let root: Value = serde_json::from_str(json_str)
        .map_err(|e| AppError::ParseError(format!("Invalid scan JSON: {}", e)))?;

    let mut findings = Vec::new();

    // Check for Trivy format: "Results" -> array -> "Vulnerabilities"
    if let Some(results) = root.get("Results").and_then(|v| v.as_array()) {
        for target in results {
            if let Some(vulns) = target.get("Vulnerabilities").and_then(|v| v.as_array()) {
                for v in vulns {
                    let vuln_id = v.get("VulnerabilityID")
                        .and_then(|s| s.as_str())
                        .unwrap_or("UNKNOWN-VULN")
                        .to_string();

                    let pkg_name = v.get("PkgName")
                        .and_then(|s| s.as_str())
                        .unwrap_or("unknown")
                        .to_string();

                    let installed_version = v.get("InstalledVersion")
                        .and_then(|s| s.as_str())
                        .unwrap_or("0.0.0")
                        .to_string();

                    let fixed_version = v.get("FixedVersion")
                        .and_then(|s| s.as_str())
                        .map(|s| s.to_string());

                    let description = v.get("Description")
                        .or_else(|| v.get("Title"))
                        .and_then(|s| s.as_str())
                        .unwrap_or("No description provided")
                        .to_string();

                    let sev_str = v.get("Severity")
                        .and_then(|s| s.as_str())
                        .unwrap_or("UNKNOWN")
                        .to_uppercase();

                    let severity = match sev_str.as_str() {
                        "CRITICAL" => Severity::Critical,
                        "HIGH" => Severity::High,
                        "MEDIUM" => Severity::Medium,
                        "LOW" => Severity::Low,
                        _ => Severity::Unknown,
                    };

                    let cvss_score = v.get("CVSS")
                        .and_then(|c| c.get("nvd"))
                        .and_then(|n| n.get("V3Score"))
                        .and_then(|s| s.as_f64())
                        .map(|f| f as f32);

                    let advisory_url = v.get("PrimaryURL")
                        .and_then(|s| s.as_str())
                        .map(|s| s.to_string());

                    findings.push(VulnerabilityFinding {
                        id: new_id(),
                        organization_id,
                        project_id,
                        release_id,
                        vuln_id,
                        severity,
                        cvss_score,
                        affected_package: pkg_name,
                        affected_version: installed_version,
                        fixed_version,
                        description,
                        advisory_url,
                        scanner_source: "trivy".to_string(),
                        remediation_status: RemediationStatus::Open,
                        first_seen_at: now_utc(),
                        last_seen_at: now_utc(),
                    });
                }
            }
        }
    } else if let Some(vulns) = root.get("vulnerabilities").and_then(|v| v.as_array()) {
        // OSV-Scanner format
        for v in vulns {
            let vuln_id = v.get("id").and_then(|s| s.as_str()).unwrap_or("OSV-UNKNOWN").to_string();
            let description = v.get("summary").or_else(|| v.get("details")).and_then(|s| s.as_str()).unwrap_or("").to_string();
            let sev_str = v.get("database_specific").and_then(|d| d.get("severity")).and_then(|s| s.as_str()).unwrap_or("MEDIUM");
            let severity = match sev_str.to_uppercase().as_str() {
                "CRITICAL" => Severity::Critical,
                "HIGH" => Severity::High,
                "LOW" => Severity::Low,
                _ => Severity::Medium,
            };

            findings.push(VulnerabilityFinding {
                id: new_id(),
                organization_id,
                project_id,
                release_id,
                vuln_id,
                severity,
                cvss_score: None,
                affected_package: "osv-detected-package".to_string(),
                affected_version: "unknown".to_string(),
                fixed_version: None,
                description,
                advisory_url: None,
                scanner_source: "osv-scanner".to_string(),
                remediation_status: RemediationStatus::Open,
                first_seen_at: now_utc(),
                last_seen_at: now_utc(),
            });
        }
    }

    Ok(findings)
}
