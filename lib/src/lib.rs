use reqwest::StatusCode;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Serialize, Deserialize)]
pub struct Word {
    word: String,
    pronunciation: String,
    definition: String,
    examples: Vec<String>,
    image: String,
}

#[wasm_bindgen]
pub async fn define_word(word: &str, api_key: &str) -> Result<JsValue, JsValue> {
    let url = format!(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={}",
        api_key.trim()
    );
    let prompt = format!(
        "please act as a dictionary, including the pronunciation, explanation, two examples of sentences, and one image. And the word is {}. please output the result in json format, the json keys are `word`, `pronunciation`, `definition`, `examples`, and `image`.",
        word.trim()
    );

    let req_client = reqwest::Client::new();
    let req_body = serde_json::json!({
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }]

    });

    let res = req_client
        .post(url)
        .json(&req_body)
        .send()
        .await
        .map_err(|e| JsValue::from_str(&format!("request error: {}", e)))?;
    if res.status() != StatusCode::OK {
        return Err(JsValue::from_str(&format!(
            "request error: {}",
            res.status()
        )));
    }
    let json = res
        .json::<serde_json::Value>()
        .await
        .map_err(|e| JsValue::from_str(&format!("json error: {}", e)))?;
    let Some(dictionary_str) = json["candidates"][0]["content"]["parts"][0]["text"].as_str() else {
        return Err(JsValue::from_str("json error: dictionary not found"));
    };
    let dictionary_str = dictionary_str
        .trim_start_matches("```json")
        .trim_start_matches("```")
        .trim_end_matches("```")
        .trim();
    let dictionary = serde_json::from_str::<Word>(dictionary_str)
        .map_err(|e| JsValue::from_str(&format!("serde error: {}", e)))?;

    Ok(serde_wasm_bindgen::to_value(&dictionary)?)
}
