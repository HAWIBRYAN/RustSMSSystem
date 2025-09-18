use axum::{
    extract::Json,
    routing::post,
    Router,
};
use serde::{Deserialize, Serialize};
use tower_http::{
    cors::{Any, CorsLayer},
    services::ServeDir,
};
use tokio::net::TcpListener;
use reqwest::Client;
use std::env;
use dotenvy::dotenv;

#[derive(Debug, Deserialize)]
struct SmsPayload {
    recipient: String,
    content: String,
}

#[derive(Debug, Serialize)]
struct TaifaSmsRequest {
    to: String,
    message: String,
    sender_id: String,
}

#[derive(Debug, Deserialize)]
struct TaifaSmsResponse {
    status: String,
    #[serde(default)]
    message_id: Option<String>,
    #[serde(default)]
    error: Option<String>,
}

async fn send_sms(Json(payload): Json<SmsPayload>) -> Json<TaifaSmsResponse> {
    let client = Client::new();
    let api_key = env::var("TAIFA_API_KEY").expect("TAIFA_API_KEY must be set");
    let api_url = env::var("TAIFA_API_URL").expect("TAIFA_API_URL must be set");
    let sender_id = env::var("SENDER_ID").unwrap_or_else(|_| "RustApp".to_string());

    let request = TaifaSmsRequest {
        to: payload.recipient,
        message: payload.content,
        sender_id,
    };

    let response = client
        .post(&api_url)
        .header("Authorization", format!("Bearer {}", api_key))
        .json(&request)
        .send()
        .await;

    match response {
        Ok(res) => {
            let result = res.json::<TaifaSmsResponse>().await.unwrap_or(TaifaSmsResponse {
                status: "failed".to_string(),
                message_id: None,
                error: Some("Invalid response from Taifa Mobile".to_string()),
            });
            Json(result)
        }
        Err(e) => Json(TaifaSmsResponse {
            status: "failed".to_string(),
            message_id: None,
            error: Some(format!("Request error: {}", e)),
        }),
    }
}

#[tokio::main]
async fn main() {
    dotenv().ok();

    let cors = CorsLayer::new()
        .allow_origin("http://localhost:5173".parse::<axum::http::HeaderValue>().unwrap())
        .allow_methods(Any)
        .allow_headers(Any);

    let api_routes = Router::new().route("/sms", post(send_sms));

    let app = Router::new()
        .nest("/api", api_routes)
        .nest_service("/", ServeDir::new("dist"))
        .layer(cors);

    let listener = TcpListener::bind("127.0.0.1:3000").await.unwrap();
    println!("🚀 Server running at http://127.0.0.1:3000");

    axum::serve(listener, app).await.unwrap();
}
