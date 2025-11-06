"use client";

import { useState } from "react";

export default function Page() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    const newMessages = [...messages, { role: "user", content: input }];

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await res.json();
    const reply = data.choices.[0].message.content;
    setMessages([...newMessages, { role: "assistant", content: reply }]);
    setInput("");
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h1>Minimal Chatbot</h1>

      <div style={{ border: "1px solid #ccc", padding: 10, minHeight: 200, marginBottom: 10 }}>
        {messages.map((m, i) => (
          <p key={i}><b>{m.role}:</b> {m.content}</p>
        ))}
      </div>

      <input
        style={{ width: "80%" }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask something..."
      />
      <button style={{ width: "18%" }} onClick={sendMessage}>Send</button>
    </div>
  );
}
