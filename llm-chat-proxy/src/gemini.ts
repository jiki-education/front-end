import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Streams a response from Gemini 2.0 Flash model.
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
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const result = await model.generateContentStream({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
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
        for await (const responseChunk of result.stream) {
          const text = responseChunk.text();

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
