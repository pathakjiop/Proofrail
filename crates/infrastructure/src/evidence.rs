use vulnledger_domain::{EvidenceFileEntry, EvidencePackage};
use vulnledger_shared::{compute_sha256, new_id, now_utc, AppError, Result};
use serde::{Deserialize, Serialize};
use std::io::{Cursor, Write};
use uuid::Uuid;
use zip::write::FileOptions;
use zip::ZipWriter;

#[derive(Serialize, Deserialize)]
pub struct ManifestFileItem {
    pub path: String,
    pub sha256: String,
    pub size_bytes: usize,
    pub file_type: String,
}

#[derive(Serialize, Deserialize)]
pub struct EvidenceManifest {
    pub product_id: String,
    pub release_version: String,
    pub generated_at: String,
    pub generator: String,
    pub files: Vec<ManifestFileItem>,
}

pub struct EvidencePackager;

impl EvidencePackager {
    pub fn build_package_zip(
        organization_id: Uuid,
        project_id: Uuid,
        release_id: Uuid,
        product_identifier: &str,
        release_version: &str,
        sbom_raw: Option<&[u8]>,
        vex_json: Option<&str>,
        scan_reports: &[(&str, &[u8])],
    ) -> Result<(EvidencePackage, Vec<u8>)> {
        let mut buffer = Vec::new();
        let mut zip = ZipWriter::new(Cursor::new(&mut buffer));
        let options = FileOptions::<()>::default()
            .compression_method(zip::CompressionMethod::Deflated)
            .unix_permissions(0o644);

        let mut manifest_items = Vec::new();
        let mut file_entries = Vec::new();

        // 1. Add SBOM if present
        if let Some(sbom_bytes) = sbom_raw {
            let sbom_path = "sbom/cyclonedx-sbom.json";
            let hash = compute_sha256(sbom_bytes);
            zip.start_file(sbom_path, options)
                .map_err(|e| AppError::Internal(format!("Zip error: {}", e)))?;
            zip.write_all(sbom_bytes)
                .map_err(|e| AppError::Internal(format!("Zip write error: {}", e)))?;

            manifest_items.push(ManifestFileItem {
                path: sbom_path.to_string(),
                sha256: hash.clone(),
                size_bytes: sbom_bytes.len(),
                file_type: "sbom".to_string(),
            });
            file_entries.push(EvidenceFileEntry {
                file_name: sbom_path.to_string(),
                file_type: "sbom".to_string(),
                sha256_hash: hash,
                size_bytes: sbom_bytes.len(),
            });
        }

        // 2. Add VEX statements
        if let Some(vex_str) = vex_json {
            let vex_path = "vex/openvex-statements.json";
            let vex_bytes = vex_str.as_bytes();
            let hash = compute_sha256(vex_bytes);
            zip.start_file(vex_path, options)
                .map_err(|e| AppError::Internal(format!("Zip error: {}", e)))?;
            zip.write_all(vex_bytes)
                .map_err(|e| AppError::Internal(format!("Zip write error: {}", e)))?;

            manifest_items.push(ManifestFileItem {
                path: vex_path.to_string(),
                sha256: hash.clone(),
                size_bytes: vex_bytes.len(),
                file_type: "vex".to_string(),
            });
            file_entries.push(EvidenceFileEntry {
                file_name: vex_path.to_string(),
                file_type: "vex".to_string(),
                sha256_hash: hash,
                size_bytes: vex_bytes.len(),
            });
        }

        // 3. Add Scan Reports
        for (name, content) in scan_reports {
            let scan_path = format!("scans/{}", name);
            let hash = compute_sha256(content);
            zip.start_file(&scan_path, options)
                .map_err(|e| AppError::Internal(format!("Zip error: {}", e)))?;
            zip.write_all(content)
                .map_err(|e| AppError::Internal(format!("Zip write error: {}", e)))?;

            manifest_items.push(ManifestFileItem {
                path: scan_path.clone(),
                sha256: hash.clone(),
                size_bytes: content.len(),
                file_type: "scan_report".to_string(),
            });
            file_entries.push(EvidenceFileEntry {
                file_name: scan_path,
                file_type: "scan_report".to_string(),
                sha256_hash: hash,
                size_bytes: content.len(),
            });
        }

        // 4. Create and add manifest.json
        let manifest = EvidenceManifest {
            product_id: product_identifier.to_string(),
            release_version: release_version.to_string(),
            generated_at: now_utc().to_rfc3339(),
            generator: "Proofrail Evidence Engine v0.1.0".to_string(),
            files: manifest_items,
        };

        let manifest_json = serde_json::to_string_pretty(&manifest)
            .map_err(|e| AppError::Internal(format!("Manifest serialization error: {}", e)))?;
        let manifest_bytes = manifest_json.as_bytes();
        let manifest_hash = compute_sha256(manifest_bytes);

        zip.start_file("manifest.json", options)
            .map_err(|e| AppError::Internal(format!("Zip error: {}", e)))?;
        zip.write_all(manifest_bytes)
            .map_err(|e| AppError::Internal(format!("Zip write error: {}", e)))?;

        file_entries.push(EvidenceFileEntry {
            file_name: "manifest.json".to_string(),
            file_type: "manifest".to_string(),
            sha256_hash: manifest_hash,
            size_bytes: manifest_bytes.len(),
        });

        // Finish zip
        zip.finish()
            .map_err(|e| AppError::Internal(format!("Failed to finalize zip package: {}", e)))?;

        let package_sha256 = compute_sha256(&buffer);
        let package_id = new_id();
        let storage_key = format!("packages/{}/{}.zip", project_id, package_id);

        let package = EvidencePackage {
            id: package_id,
            organization_id,
            project_id,
            release_id,
            package_version: release_version.to_string(),
            sha256_hash: package_sha256,
            file_entries,
            storage_key,
            created_at: now_utc(),
        };

        Ok((package, buffer))
    }
}
