import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export const runtime = "edge";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Convert messages for OpenRouter
    const formattedMessages = messages.map((m: any) => ({
      role: m.role,
      content: m.content,
    }));

    // Call OpenRouter for a simple completion (non-streaming)
    const completion = await openrouter.chat({
      model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
      messages: formattedMessages,
    });

    // Extract text (ensure it's a string)
    const text = completion.choices?.[0]?.message?.content ?? "No response";

    return new Response(JSON.stringify({ text }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("API error:", err);
    return new Response(JSON.stringify({ text: "Something went wrong." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
