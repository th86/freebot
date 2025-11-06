"use client";

import { useState } from "react";
import { useChat, type UIMessage } from "@ai-sdk/react";

export default function Page() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: {
      api: "/api/chat",
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <main style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <h1>My Chatbot</h1>

      <div style={{ marginBottom: "1rem" }}>
        {messages.map((m: UIMessage, i: number) => (
          <div key={i}>
            <strong>{m.role}:</strong>{" "}
            {m.parts.map(p => (p.type === "text" ? p.text : ""))}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Say something…"
          style={{ flex: 1 }}
        />
        <button type="submit" disabled={status === "loading"}>
          Send
        </button>
      </form>
    </main>
  );
}
