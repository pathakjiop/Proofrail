use vulnledger_domain::Component;
use vulnledger_shared::{new_id, AppError, Result};
use serde_json::Value;
use uuid::Uuid;

pub struct ParsedSbomData {
    pub spec_version: String,
    pub components: Vec<Component>,
}

pub fn parse_cyclonedx_json(sbom_id: Uuid, json_str: &str) -> Result<ParsedSbomData> {
    let root: Value = serde_json::from_str(json_str)
        .map_err(|e| AppError::ParseError(format!("Invalid CycloneDX JSON format: {}", e)))?;

    let spec_version = root
        .get("specVersion")
        .and_then(|v| v.as_str())
        .unwrap_or("1.5")
        .to_string();

    let mut components = Vec::new();

    if let Some(comp_array) = root.get("components").and_then(|v| v.as_array()) {
        for item in comp_array {
            let name = item
                .get("name")
                .and_then(|v| v.as_str())
                .unwrap_or("unknown")
                .to_string();
            let version = item
                .get("version")
                .and_then(|v| v.as_str())
                .unwrap_or("unknown")
                .to_string();
            let purl = item
                .get("purl")
                .and_then(|v| v.as_str())
                .map(|s| s.to_string());
            let component_type = item
                .get("type")
                .and_then(|v| v.as_str())
                .unwrap_or("library")
                .to_string();

            // Extract license if available
            let mut license = None;
            if let Some(licenses) = item.get("licenses").and_then(|v| v.as_array()) {
                if let Some(first) = licenses.first() {
                    if let Some(lic_obj) = first.get("license") {
                        if let Some(id_str) = lic_obj.get("id").and_then(|v| v.as_str()) {
                            license = Some(id_str.to_string());
                        } else if let Some(name_str) = lic_obj.get("name").and_then(|v| v.as_str()) {
                            license = Some(name_str.to_string());
                        }
                    }
                }
            }

            let supplier = item
                .get("supplier")
                .and_then(|v| v.get("name"))
                .and_then(|v| v.as_str())
                .map(|s| s.to_string());

            components.push(Component {
                id: new_id(),
                sbom_id,
                name,
                version,
                purl,
                license,
                supplier,
                component_type,
            });
        }
    }

    Ok(ParsedSbomData {
        spec_version,
        components,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_cyclonedx_basic() {
        let json = r#"{
            "bomFormat": "CycloneDX",
            "specVersion": "1.5",
            "components": [
                {
                    "name": "axum",
                    "version": "0.8.1",
                    "type": "library",
                    "purl": "pkg:cargo/axum@0.8.1",
                    "licenses": [{"license": {"id": "MIT"}}]
                }
            ]
        }"#;

        let res = parse_cyclonedx_json(Uuid::new_v4(), json).unwrap();
        assert_eq!(res.components.len(), 1);
        assert_eq!(res.components[0].name, "axum");
        assert_eq!(res.components[0].license.as_deref(), Some("MIT"));
    }
}
