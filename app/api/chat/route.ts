import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";

export const runtime = "edge";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await streamText({
    model: openrouter("deepseek/deepseek-r1-0528-qwen3-8b:free"),
    messages,
  });

  return new Response(
    JSON.stringify({ text: response.text }),
    { headers: { "Content-Type": "application/json" } }
  );
}
