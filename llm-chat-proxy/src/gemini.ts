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

function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    if ("retryable" in error && (error as { retryable: boolean }).retryable === true) {
      return true;
    }
    if (error.message.includes("Network connection lost")) {
      return true;
    }
  }
  return false;
}

const MAX_RETRIES = 2;
const RETRY_BASE_DELAY_MS = 250;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type ModelConfig = (typeof MODEL_CHAIN)[number]["config"];
type GeminiStream = Awaited<ReturnType<GoogleGenAI["models"]["generateContentStream"]>>;

/**
 * Attempts to open a stream for a single model, retrying transient network
 * errors with exponential backoff. Returns "rate-limited" so the caller can
 * cascade to the next model; throws on non-retryable errors.
 */
async function tryModel(
  ai: GoogleGenAI,
  model: string,
  config: ModelConfig,
  prompt: string
): Promise<GeminiStream | "rate-limited"> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await ai.models.generateContentStream({ model, contents: prompt, config });
      console.log(`[Gemini] Using model: ${model}`);
      return result;
    } catch (error) {
      if (isRateLimitError(error)) {
        console.log(`[Gemini] Rate limited on ${model}, trying next model`);
        return "rate-limited";
      }
      if (isRetryableError(error) && attempt < MAX_RETRIES) {
        const backoff = RETRY_BASE_DELAY_MS * 2 ** attempt;
        console.log(
          `[Gemini] Retryable error on ${model} (attempt ${attempt + 1}/${MAX_RETRIES}), retrying in ${backoff}ms`
        );
        await delay(backoff);
        continue;
      }
      throw error;
    }
  }
  throw new Error(`[Gemini] Exhausted retries for ${model}`);
}

/**
 * Opens a stream from the first available model, cascading through the chain
 * on rate limits. Throws if every model is rate limited.
 */
async function openModelStream(ai: GoogleGenAI, prompt: string): Promise<GeminiStream> {
  for (const { model, config } of MODEL_CHAIN) {
    const result = await tryModel(ai, model, config, prompt);
    if (result !== "rate-limited") {
      return result;
    }
  }
  throw new Error("All Gemini models are rate limited");
}

/**
 * Wraps a Gemini stream as a ReadableStream of text chunks, invoking onChunk
 * for each non-empty chunk.
 */
function toTextStream(result: GeminiStream, onChunk?: (chunk: string) => void): ReadableStream {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of result) {
          const text = chunk.text ?? "";
          if (text.length === 0) {
            continue;
          }
          onChunk?.(text);
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
  const result = await openModelStream(ai, prompt);
  return toTextStream(result, onChunk);
}
