import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";  // use generateText for non‑streaming

export const runtime = "edge";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const formatted = messages.map((m: any) => ({
      role: m.role,
      content: m.content,
    }));

    const model = openrouter("deepseek/deepseek-r1-0528-qwen3-8b:free");

    const result = await generateText({
      model,
      messages: formatted,
    });

    return new Response(
      JSON.stringify({ text: result.text }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("API error:", err);
    return new Response(
      JSON.stringify({ text: "Something went wrong." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
