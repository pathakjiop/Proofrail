use vulnledger_domain::Component;
use vulnledger_shared::{new_id, AppError, Result};
use serde_json::Value;
use uuid::Uuid;
use super::cyclonedx::ParsedSbomData;

pub fn parse_spdx_json(sbom_id: Uuid, json_str: &str) -> Result<ParsedSbomData> {
    let root: Value = serde_json::from_str(json_str)
        .map_err(|e| AppError::ParseError(format!("Invalid SPDX JSON format: {}", e)))?;

    let spec_version = root
        .get("spdxVersion")
        .and_then(|v| v.as_str())
        .unwrap_or("SPDX-2.3")
        .to_string();

    let mut components = Vec::new();

    if let Some(pkg_array) = root.get("packages").and_then(|v| v.as_array()) {
        for pkg in pkg_array {
            let name = pkg
                .get("name")
                .and_then(|v| v.as_str())
                .unwrap_or("unknown")
                .to_string();

            let version = pkg
                .get("versionInfo")
                .and_then(|v| v.as_str())
                .unwrap_or("unknown")
                .to_string();

            let license = pkg
                .get("licenseConcluded")
                .or_else(|| pkg.get("licenseDeclared"))
                .and_then(|v| v.as_str())
                .filter(|s| *s != "NOASSERTION" && *s != "NONE")
                .map(|s| s.to_string());

            let supplier = pkg
                .get("supplier")
                .and_then(|v| v.as_str())
                .filter(|s| *s != "NOASSERTION")
                .map(|s| s.to_string());

            // Extract external ref for purl
            let mut purl = None;
            if let Some(ext_refs) = pkg.get("externalRefs").and_then(|v| v.as_array()) {
                for r in ext_refs {
                    if let Some(ref_type) = r.get("referenceType").and_then(|v| v.as_str()) {
                        if ref_type == "purl" {
                            purl = r.get("referenceLocator").and_then(|v| v.as_str()).map(|s| s.to_string());
                            break;
                        }
                    }
                }
            }

            components.push(Component {
                id: new_id(),
                sbom_id,
                name,
                version,
                purl,
                license,
                supplier,
                component_type: "package".to_string(),
            });
        }
    }

    Ok(ParsedSbomData {
        spec_version,
        components,
    })
}
