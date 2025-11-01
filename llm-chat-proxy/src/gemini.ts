import { GoogleGenAI } from "@google/genai";

/**
 * Streams a response from Gemini 2.5 Flash-Lite model.
 * Yields chunks of text as they become available.
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

  const result = await ai.models.generateContentStream({
    model: "gemini-2.5-flash-lite",
    contents: prompt,
    config: {
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 2048
    }
  });

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
