import { GoogleGenAI } from "@google/genai";

const MODEL_CHAIN = [
  {
    model: "gemini-2.5-flash",
    config: {
      maxOutputTokens: 2048,
      thinkingConfig: { thinkingBudget: 1024 }
    }
  },
  {
    model: "gemini-2.5-flash-lite",
    config: {
      maxOutputTokens: 2048,
      thinkingConfig: { thinkingBudget: 1024 }
    }
  }
];

function isRateLimitError(error: unknown): boolean {
  if (error instanceof Error) {
    if ("status" in error && (error as { status: number }).status === 429) {
      return true;
    }
    if (error.message.includes("RESOURCE_EXHAUSTED")) {
      return true;
    }
  }
  return false;
}

/**
 * Streams a response from Gemini, cascading through models on rate limits.
 * Tries gemini-2.5-flash -> gemini-2.5-flash-lite.
 *
 * @param prompt - The full prompt to send to Gemini
 * @param apiKey - Google Gemini API key
 * @param onChunk - Optional callback for each chunk (for collecting full response)
 * @returns A ReadableStream of text chunks
 */
export async function streamGeminiResponse(
  prompt: string,
  apiKey: string,
  onChunk?: (chunk: string) => void
): Promise<ReadableStream> {
  const ai = new GoogleGenAI({ apiKey });

  let result;
  for (const { model, config } of MODEL_CHAIN) {
    try {
      result = await ai.models.generateContentStream({
        model,
        contents: prompt,
        config
      });
      console.log(`[Gemini] Using model: ${model}`);
      break;
    } catch (error) {
      if (isRateLimitError(error)) {
        console.log(`[Gemini] Rate limited on ${model}, trying next model`);
        continue;
      }
      throw error;
    }
  }

  if (!result) {
    throw new Error("All Gemini models are rate limited");
  }

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of result) {
          const text = chunk.text ?? "";

          // Skip empty chunks
          if (text.length === 0) {
            continue;
          }

          // Call callback if provided (for collecting full response)
          if (onChunk !== undefined) {
            onChunk(text);
          }

          // Send to client
          controller.enqueue(encoder.encode(text));
        }
        controller.close();
      } catch (error) {
        console.error("Gemini streaming error:", error);
        controller.error(error);
      }
    }
  });
}
