use async_trait::async_trait;

use crate::{http_request, Dictionary, WordDefinition};

pub struct GeminiDictionary {
    api_key: String,
}

impl GeminiDictionary {
    pub fn new(api_key: &str) -> Self {
        Self {
            api_key: api_key.trim().to_string(),
        }
    }
}

#[async_trait(?Send)]
impl Dictionary for GeminiDictionary {
    async fn define(&self, word: &str) -> Result<WordDefinition, String> {
        let url = format!(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={}",
            self.api_key
        );
        let req_body = serde_json::json!({
            "contents": [{
                "parts": [{
                    "text": self.default_prompt(word)
                }]
            }]
        });

        let res_body = http_request::make_request(&url, req_body).await?;
        let dictionary = extract_dictionary(res_body)?;
        Ok(dictionary)
    }
}

fn extract_dictionary(res_body: serde_json::Value) -> Result<WordDefinition, String> {
    let Some(dictionary_str) = res_body["candidates"][0]["content"]["parts"][0]["text"].as_str()
    else {
        return Err("json error: dictionary not found".to_string());
    };
    let dictionary_str = dictionary_str
        .trim_start_matches("```json")
        .trim_start_matches("```")
        .trim_end_matches("```")
        .trim();
    let definition = serde_json::from_str::<WordDefinition>(dictionary_str)
        .map_err(|e| format!("serde error: {}", e))?;
    Ok(definition)
}
