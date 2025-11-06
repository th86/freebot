import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";

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

    // Get the model
    const model = openrouter("deepseek/deepseek-r1-0528-qwen3-8b:free");

    // Use streamText to get result
    const response = await streamText({
      model,
      messages: formatted,
    });

    // Wait for stream to finish if necessary
    await response.consumeStream();

    return new Response(
      JSON.stringify({ text: response.text }),
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
