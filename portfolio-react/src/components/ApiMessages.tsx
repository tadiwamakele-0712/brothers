import { useEffect, useState } from "react";
import { fetchMessages } from "../api/portfolioApi";
import type { ApiMessage } from "../api/client";

export default function ApiMessages() {
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMessages()
      .then(setMessages)
      .catch(() => setError("API haisi kushanda — run backend-api server."));
  }, []);

  if (error) {
    return <p className="section-intro">{error}</p>;
  }

  if (!messages.length) {
    return <p className="section-intro">Hapana messages parizvino — tumira imwe!</p>;
  }

  return (
    <ul className="api-messages">
      {messages.slice(0, 5).map((msg) => (
        <li key={msg.id}>
          <strong>{msg.name}</strong>: {msg.message}
          <span className="msg-meta">
            {msg.email} · {new Date(msg.date).toLocaleString()}
          </span>
        </li>
      ))}
    </ul>
  );
}
