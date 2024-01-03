mod utils;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn greet(text: &str) -> String {
    format!("Hello, {}!", text)
}
