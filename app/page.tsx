"use client";

import { useChat } from "@ai/react";

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat"
  });

  return (
    <main style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <h1>My Chatbot</h1>

      <div style={{ marginBottom: "1rem" }}>
        {messages.map((m) => (
          <div key={m.id}>
            <strong>{m.role}:</strong> {m.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Say something…"
          style={{ flex: 1 }}
        />
        <button type="submit">Send</button>
      </form>
    </main>
  );
}
