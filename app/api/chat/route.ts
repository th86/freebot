import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-chat-v3.1:free",
      messages,
    }),
  });

  const data = await response.json();
  return NextResponse.json(data);
}
