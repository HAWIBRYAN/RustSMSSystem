// src/components/SMSList.tsx
import React from "react";

interface Sms {
  id: number;
  recipient: string;
  content: string;
  created_at: string;
}

interface SMSListProps {
  messages: Sms[];
}

const SMSList: React.FC<SMSListProps> = ({ messages }) => {
  if (!messages.length) return <p>No messages yet.</p>;

  return (
    <div>
      <h2>Sent SMS</h2>
      <ul>
        {messages.map((sms) => (
          <li key={sms.id}>
            <strong>To:</strong> {sms.recipient} <br />
            <strong>Message:</strong> {sms.content} <br />
            <small>{new Date(sms.created_at).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SMSList;
