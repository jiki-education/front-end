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
type GeminiChunk = GeminiStream extends AsyncIterable<infer C> ? C : never;

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
  let attempt = 0;
  while (true) {
    try {
      const result = await ai.models.generateContentStream({ model, contents: prompt, config });
      console.log(`[Gemini] Using model: ${model}`);
      return result;
    } catch (error) {
      if (isRateLimitError(error)) {
        console.log(`[Gemini] Rate limited on ${model}, trying next model`);
        return "rate-limited";
      }
      if (!isRetryableError(error) || attempt === MAX_RETRIES) {
        throw error;
      }
      const backoff = RETRY_BASE_DELAY_MS * 2 ** attempt;
      console.log(
        `[Gemini] Retryable error on ${model} (attempt ${attempt + 1}/${MAX_RETRIES}), retrying in ${backoff}ms`
      );
      await delay(backoff);
      attempt++;
    }
  }
}

/**
 * Opens a stream from the first available model, cascading through the chain
 * on rate limits. Throws if every model is rate limited. Returns the model name
 * alongside the stream so usage can be attributed to the model that served it.
 */
async function openModelStream(ai: GoogleGenAI, prompt: string): Promise<{ result: GeminiStream; model: string }> {
  for (const { model, config } of MODEL_CHAIN) {
    const result = await tryModel(ai, model, config, prompt);
    if (result !== "rate-limited") {
      return { result, model };
    }
  }
  throw new Error("All Gemini models are rate limited");
}

/**
 * Logs token usage for a completed request. Breaks output into thinking vs
 * visible tokens (thinking is billed as output) and surfaces cached prefix
 * tokens, so we can measure the impact of the thinking budget and prefix caching.
 */
function logUsage(model: string, usage: GeminiChunk): void {
  const meta = (usage as { usageMetadata?: Record<string, number> }).usageMetadata;
  if (!meta) {
    return;
  }

  const promptTokens = meta.promptTokenCount ?? 0;
  const cachedTokens = meta.cachedContentTokenCount ?? 0;
  // thoughtsTokenCount is billed as output but reported SEPARATELY from
  // candidatesTokenCount (the visible answer). Billed output = candidates + thoughts.
  const visibleTokens = meta.candidatesTokenCount ?? 0;
  const thinkingTokens = meta.thoughtsTokenCount ?? 0;
  const outputTokens = visibleTokens + thinkingTokens;
  const totalTokens = meta.totalTokenCount ?? 0;
  const cachedPct = promptTokens > 0 ? Math.round((cachedTokens / promptTokens) * 100) : 0;

  console.log(
    `[Gemini Usage] model=${model} input=${promptTokens} (cached=${cachedTokens}, ${cachedPct}%) ` +
      `output=${outputTokens} (thinking=${thinkingTokens}, visible=${visibleTokens}) ` +
      `total=${totalTokens}`
  );
}

/**
 * Wraps a Gemini stream as a ReadableStream of text chunks, invoking onChunk
 * for each non-empty chunk. Captures usage metadata (which arrives on the final
 * chunk, often with empty text) and logs it once streaming completes.
 */
function toTextStream(result: GeminiStream, model: string, onChunk?: (chunk: string) => void): ReadableStream {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      let lastChunk: GeminiChunk | undefined;
      try {
        for await (const chunk of result) {
          // Keep the latest chunk so we can read its usageMetadata after the
          // loop. The final chunk carries the totals and may have empty text.
          lastChunk = chunk;
          const text = chunk.text ?? "";
          if (text.length === 0) {
            continue;
          }
          onChunk?.(text);
          controller.enqueue(encoder.encode(text));
        }
        if (lastChunk !== undefined) {
          logUsage(model, lastChunk);
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
  const { result, model } = await openModelStream(ai, prompt);
  return toTextStream(result, model, onChunk);
}
