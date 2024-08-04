mod gemini_dictionary;
mod http_request;

use async_trait::async_trait;
use gemini_dictionary::GeminiDictionary;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Serialize, Deserialize)]
pub struct WordDefinition {
    word: String,
    pronunciation: String,
    definition: String,
    examples: Vec<String>,
    image: String,
}

const PROMPT_TEMPLATE: &str = "please act as a dictionary, including the pronunciation, explanation, two examples of sentences, and one image. And the word is `{:word}`. please output the result in json format, the json keys are `word`, `pronunciation`, `definition`, `examples`, and `image`.";

#[async_trait(?Send)]
pub trait Dictionary {
    // fn set_llm_model(&self, model: &str) -> Result<&Self, String>;
    async fn define(&self, word: &str) -> Result<WordDefinition, String>;
    // fn get_llm_models(&self) -> Result<Vec<String>, String>;
    fn default_prompt(&self, word: &str) -> String {
        PROMPT_TEMPLATE.replace("{:word}", word.trim())
    }
}

#[wasm_bindgen]
pub async fn define_word(word: &str, api_key: &str) -> Result<JsValue, JsValue> {
    let dictionary = GeminiDictionary::new(api_key);
    let word_defination = dictionary
        .define(word)
        .await
        .map_err(|e| JsValue::from_str(&e))?;

    Ok(serde_wasm_bindgen::to_value(&word_defination)?)
}
