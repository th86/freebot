"use client";

import { useState } from "react";
import { type UIMessage } from "@ai-sdk/react";

export default function Page() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  // Generate a simple unique ID for messages
  const generateId = () => `${Date.now()}-${Math.random()}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: UIMessage = {
      id: generateId(),
      role: "user",
      parts: [{ type: "text", text: input }],
    };
    setMessages((prev) => [...prev, userMessage]);
    setStatus("loading");

    try {
      // Send user message to API
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: input }],
        }),
      });
      const data = await res.json();

      // Add assistant message
      const assistantMessage: UIMessage = {
        id: generateId(),
        role: "assistant",
        parts: [{ type: "text", text: data.text }],
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setStatus("idle");
      setInput("");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <main style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <h1>My Chatbot</h1>

      <div style={{ marginBottom: "1rem" }}>
        {messages.map((m) => (
          <div key={m.id} style={{ marginBottom: 8 }}>
            <strong>{m.role}:</strong>{" "}
            {m.parts.map((p) => (p.type === "text" ? p.text : ""))}
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

      {status === "error" && (
        <p style={{ color: "red", marginTop: 8 }}>Something went wrong.</p>
      )}
    </main>
  );
}
