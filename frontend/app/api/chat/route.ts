import { NextRequest } from "next/server";
import { ai } from "@/lib/ai/gemini";
import { buildCopilotSystemPrompt } from "@/lib/ai/prompts/copilot";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response("Invalid messages format", { status: 400 });
    }

    const systemPrompt = buildCopilotSystemPrompt(context || {});

    // Gemini doesn't use standard "system" role in the same way for basic chat, 
    // but we can prepend the system prompt as the first user message, or use systemInstruction in config.
    // The @google/genai library supports systemInstruction.

    // Format messages for @google/genai: { role: 'user' | 'model', parts: [{ text: string }] }
    const formattedMessages = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const responseStream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: formattedMessages,
      config: {
        systemInstruction: systemPrompt,
      }
    });

    // Create a ReadableStream to stream the response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            if (chunk.text) {
              // Standard format for SSE or basic text stream. We'll just stream text chunks for simplicity.
              controller.enqueue(new TextEncoder().encode(chunk.text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      }
    });
  } catch (error: unknown) {
    console.error("Chat API Error:", error);
    return new Response(error instanceof Error ? error.message : "Internal Server Error", { status: 500 });
  }
}
