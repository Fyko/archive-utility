use serde_wasm_bindgen::to_value;

#[derive(Debug, thiserror::Error)]
pub enum DisplayError {
    #[error("Reqwest error: {0}")]
    Reqwest(#[from] reqwest::Error),
    #[error("Worker error: {0}")]
    Worker(#[from] worker::Error),
}

impl From<DisplayError> for worker::Error {
    fn from(error: DisplayError) -> Self {
        match error {
            DisplayError::Reqwest(e) => {
                worker::Error::Internal(to_value(&format!("Reqwest error: {}", e)).unwrap())
            }
            DisplayError::Worker(e) => e,
        }
    }
}
