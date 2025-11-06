import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";

export const runtime = "edge"; // recommended for Vercel

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Convert messages to OpenRouter format
    const formattedMessages = messages.map((m: any) => ({
      role: m.role,
      content: m.content,
    }));

    // Stream text response from OpenRouter
    const response = await streamText({
      model: openrouter("deepseek/deepseek-r1-0528-qwen3-8b:free"),
      messages: formattedMessages,
    });

    // Return JSON containing the assistant text
    return new Response(
      JSON.stringify({ text: response.text }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error in /api/chat:", err);
    return new Response(
      JSON.stringify({ text: "Something went wrong." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
