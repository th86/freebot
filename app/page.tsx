"use client";

import { useState } from "react";

type Message = { id: string; role: "user" | "assistant"; text: string };

export default function Page() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const generateId = () => `${Date.now()}-${Math.random()}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: generateId(), role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setStatus("loading");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, { role: "user", content: input }] }),
      });

      const data = await res.json();

      const assistantMessage: Message = { id: generateId(), role: "assistant", text: data.text };
      setMessages((prev) => [...prev, assistantMessage]);
      setInput("");
      setStatus("idle");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <main style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <h1>My Chatbot</h1>

      <div style={{ marginBottom: 16 }}>
        {messages.map((m) => (
          <div key={m.id}>
            <strong>{m.role}:</strong> {m.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Say something…"
          style={{ flex: 1 }}
        />
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Sending..." : "Send"}
        </button>
      </form>

      {status === "error" && <p style={{ color: "red" }}>Something went wrong.</p>}
    </main>
  );
}
