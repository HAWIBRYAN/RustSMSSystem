// src/App.tsx
import React, { useState, useEffect } from "react";
import SendSMS from "./components/SendSMS";
import SMSList from "./components/SMSList";

interface Sms {
  id: number;
  recipient: string;
  content: string;
  created_at: string;
}

function App() {
  const [messages, setMessages] = useState<Sms[]>([]);

  // fetch all SMS messages
  const fetchMessages = () => {
    fetch("http://127.0.0.1:3000/sms")
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Error fetching SMS:", err));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div>
      <h1>SMS Dashboard</h1>
      <SendSMS onSmsSent={fetchMessages} />
      <SMSList messages={messages} />
    </div>
  );
}

export default App;
