// src/components/SendSMS.tsx
import React, { useState } from "react";

interface SendSMSProps {
  onSmsSent: () => void;
}

const SendSMS: React.FC<SendSMSProps> = ({ onSmsSent }) => {
  const [recipient, setRecipient] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await fetch("http://127.0.0.1:3000/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient, content }),
      });

      setRecipient("");
      setContent("");

      // refresh SMS list
      onSmsSent();
    } catch (err) {
      console.error("Error sending SMS:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        placeholder="Recipient"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Message"
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default SendSMS;

