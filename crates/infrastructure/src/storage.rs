use vulnledger_shared::{AppError, Result};
use async_trait::async_trait;
use std::path::{Path, PathBuf};
use tokio::fs;

#[async_trait]
pub trait StorageService: Send + Sync {
    async fn save_file(&self, key: &str, content: &[u8]) -> Result<()>;
    async fn read_file(&self, key: &str) -> Result<Vec<u8>>;
    async fn exists(&self, key: &str) -> bool;
    async fn delete_file(&self, key: &str) -> Result<()>;
}

pub struct LocalStorageService {
    base_dir: PathBuf,
}

impl LocalStorageService {
    pub fn new<P: AsRef<Path>>(base_dir: P) -> Self {
        Self {
            base_dir: base_dir.as_ref().to_path_buf(),
        }
    }

    fn resolve_path(&self, key: &str) -> Result<PathBuf> {
        // Prevent path traversal attack
        if key.contains("..") || key.starts_with('/') || key.starts_with('\\') {
            return Err(AppError::Validation("Invalid file key: path traversal detected".into()));
        }

        let full_path = self.base_dir.join(key);
        Ok(full_path)
    }
}

#[async_trait]
impl StorageService for LocalStorageService {
    async fn save_file(&self, key: &str, content: &[u8]) -> Result<()> {
        let full_path = self.resolve_path(key)?;
        if let Some(parent) = full_path.parent() {
            fs::create_dir_all(parent)
                .await
                .map_err(|e| AppError::Internal(format!("Failed to create storage dir: {}", e)))?;
        }
        fs::write(&full_path, content)
            .await
            .map_err(|e| AppError::Internal(format!("Failed to write storage file: {}", e)))?;
        Ok(())
    }

    async fn read_file(&self, key: &str) -> Result<Vec<u8>> {
        let full_path = self.resolve_path(key)?;
        fs::read(&full_path)
            .await
            .map_err(|e| AppError::NotFound(format!("File not found in storage: {}", e)))
    }

    async fn exists(&self, key: &str) -> bool {
        match self.resolve_path(key) {
            Ok(path) => path.exists(),
            Err(_) => false,
        }
    }

    async fn delete_file(&self, key: &str) -> Result<()> {
        let full_path = self.resolve_path(key)?;
        if full_path.exists() {
            fs::remove_file(&full_path)
                .await
                .map_err(|e| AppError::Internal(format!("Failed to delete storage file: {}", e)))?;
        }
        Ok(())
    }
}
