# 📱 Rust SMS System

A simple SMS management system built with **Rust (Axum)** for the backend and **React (Vite + TypeScript)** for the frontend.  
The system integrates with the **Taifa Mobile API** for sending and managing SMS messages.

---

## 🚀 Features
- Rust backend using **Axum** and **Tower HTTP**
- React frontend with **Vite** and **TypeScript**
- Integration with **Taifa Mobile API**
- Unified development workflow (`npm run dev` starts both frontend + backend)
- RESTful API endpoints

---

## 📦 Prerequisites
Make sure you have installed:
- [Rust](https://www.rust-lang.org/tools/install) (latest stable)
- [Node.js](https://nodejs.org/) (>=18)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

---

## 🔧 Installation

1. **Clone the repository**
   git clone git@github.com:HAWIBRYAN/RustSMSSystem.git
   cd RustSMSSystem

2. **Install frontend dependencies**
   cd frontend
   npm install

3. **Set up backend**
   cd ../backend
   cargo build

4. **Environment variables**
   Create a `.env` file inside `backend/` with your Taifa Mobile API credentials:

   TAIFA_API_KEY=your_api_key_here
   TAIFA_API_SECRET=your_api_secret_here
   TAIFA_BASE_URL=https://api.taifamobile.com

---

## ▶️ Running the project

### Development mode

Start both frontend and backend together:


npm run dev

* Backend runs on: `http://127.0.0.1:3000`
* Frontend runs on: `http://127.0.0.1:5173`

### Build for production

npm run build

### Run backend only
cd backend
cargo run

### Run frontend only
cd frontend
npm run dev
---

## 📡 API Endpoints

### `POST /send-sms`

Send an SMS via Taifa Mobile API.
**Request body:**

{
  "to": "+2547XXXXXXX",
  "message": "Hello from Rust SMS System!"
}

**Response:**

{
  "status": "success",
  "message_id": "abc123"
}

---

## 💻 Example Code

### Backend (Rust - `handlers.rs`)

use axum::{Json, http::StatusCode};
use serde::{Deserialize, Serialize};
use reqwest::Client;
use std::env;

#[derive(Deserialize)]
pub struct SmsRequest {
    pub to: String,
    pub message: String,
}

#[derive(Serialize)]
pub struct SmsResponse {
    pub status: String,
    pub message_id: Option<String>,
}

pub async fn send_sms(Json(payload): Json<SmsRequest>) -> Result<Json<SmsResponse>, (StatusCode, String)> {
    let api_key = env::var("TAIFA_API_KEY").unwrap();
    let api_secret = env::var("TAIFA_API_SECRET").unwrap();
    let base_url = env::var("TAIFA_BASE_URL").unwrap();
    let client = Client::new();
    let res = client
        .post(format!("{}/sms/send", base_url))
        .header("Authorization", format!("Bearer {}", api_key))
        .json(&payload)
        .send()
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    let status = if res.status().is_success() { "success" } else { "failed" };
    Ok(Json(SmsResponse {
        status: status.to_string(),
        message_id: Some("mock123".to_string()), // replace with actual response parsing
    }))
}


### Frontend (React - `SendSMS.tsx`)

import React, { useState } from "react";

export default function SendSMS() {
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://127.0.0.1:3000/send-sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, message }),
    });
    const data = await res.json();
    setResponse(JSON.stringify(data, null, 2));
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">Send SMS</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Recipient number"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="border p-2 w-full"
        />
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Send
        </button>
      </form>
      {response && (
        <pre className="bg-gray-100 mt-4 p-2 rounded">{response}</pre>
      )}
    </div>
  );
}


---

## 🛠 Tech Stack

* **Backend:** Rust, Axum, Tower HTTP
* **Frontend:** React, Vite, TypeScript, TailwindCSS
* **SMS Provider:** Taifa Mobile API

---

## 📌 Next Steps

* Add authentication (JWT)
* Store SMS logs in a database (SQLite/MySQL/Postgres)
* Add UI for viewing sent/received SMS

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m "Added feature"`)
4. Push to branch (`git push origin feature-name`)
5. Open a Pull Request

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

```
