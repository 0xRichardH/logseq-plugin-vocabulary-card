use reqwest::StatusCode;

pub async fn make_request(url: &str, body: serde_json::Value) -> Result<serde_json::Value, String> {
    let req_client = reqwest::Client::new();
    let res = req_client
        .post(url)
        .json(&body)
        .send()
        .await
        .map_err(|e| format!("request error: {}", e))?;
    if res.status() != StatusCode::OK {
        return Err(format!("request error: {}", res.status()));
    }
    let json = res
        .json::<serde_json::Value>()
        .await
        .map_err(|e| format!("json error: {}", e))?;
    Ok(json)
}
