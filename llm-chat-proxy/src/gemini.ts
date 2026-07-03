import { GoogleGenAI } from "@google/genai";
import { debugLog } from "./log";

/**
 * Token usage for a completed request. Output is split into thinking vs visible
 * (both billed as output); cachedTokens is the prefix-cached portion of the input.
 */
export interface GeminiUsage {
  inputTokens: number;
  cachedTokens: number;
  outputTokens: number;
  thinkingTokens: number;
  visibleTokens: number;
  totalTokens: number;
}

/** Result of opening a Gemini stream: the text stream, the model that served it,
 *  and a promise resolving to token usage once streaming completes (null if the
 *  final chunk carried no usageMetadata). */
export interface GeminiStreamResult {
  stream: ReadableStream;
  model: string;
  usage: Promise<GeminiUsage | null>;
}

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
  prompt: string,
  systemInstruction: string
): Promise<GeminiStream | "rate-limited"> {
  let attempt = 0;
  while (true) {
    try {
      const result = await ai.models.generateContentStream({
        model,
        contents: prompt,
        config: { ...config, systemInstruction }
      });
      debugLog(`[Gemini] Using model: ${model}`);
      return result;
    } catch (error) {
      if (isRateLimitError(error)) {
        debugLog(`[Gemini] Rate limited on ${model}, trying next model`);
        return "rate-limited";
      }
      if (!isRetryableError(error) || attempt === MAX_RETRIES) {
        throw error;
      }
      const backoff = RETRY_BASE_DELAY_MS * 2 ** attempt;
      debugLog(
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
async function openModelStream(
  ai: GoogleGenAI,
  prompt: string,
  systemInstruction: string
): Promise<{ result: GeminiStream; model: string }> {
  for (const { model, config } of MODEL_CHAIN) {
    const result = await tryModel(ai, model, config, prompt, systemInstruction);
    if (result !== "rate-limited") {
      return { result, model };
    }
  }
  throw new Error("All Gemini models are rate limited");
}

/**
 * Extracts token usage from the final stream chunk. Breaks output into thinking
 * vs visible tokens (thinking is billed as output) and surfaces cached prefix
 * tokens, so callers can measure the thinking budget and prefix-caching impact.
 * Returns null if the chunk carried no usageMetadata.
 */
function extractUsage(chunk: GeminiChunk): GeminiUsage | null {
  const meta = (chunk as { usageMetadata?: Record<string, number> }).usageMetadata;
  if (!meta) {
    return null;
  }

  // thoughtsTokenCount is billed as output but reported SEPARATELY from
  // candidatesTokenCount (the visible answer). Billed output = candidates + thoughts.
  const visibleTokens = meta.candidatesTokenCount ?? 0;
  const thinkingTokens = meta.thoughtsTokenCount ?? 0;

  return {
    inputTokens: meta.promptTokenCount ?? 0,
    cachedTokens: meta.cachedContentTokenCount ?? 0,
    outputTokens: visibleTokens + thinkingTokens,
    thinkingTokens,
    visibleTokens,
    totalTokens: meta.totalTokenCount ?? 0
  };
}

/**
 * Wraps a Gemini stream as a ReadableStream of text chunks, invoking onChunk
 * for each non-empty chunk. Captures usage metadata (which arrives on the final
 * chunk, often with empty text) and resolves `onUsage` with it once streaming
 * completes, so the caller can attribute cost in its own summary log.
 */
function toTextStream(
  result: GeminiStream,
  onChunk: ((chunk: string) => void) | undefined,
  onUsage: (usage: GeminiUsage | null) => void
): ReadableStream {
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
        onUsage(lastChunk !== undefined ? extractUsage(lastChunk) : null);
        controller.close();
      } catch (error) {
        console.error("Gemini streaming error:", error);
        onUsage(null);
        controller.error(error);
      }
    }
  });
}

/**
 * Streams a response from Gemini, cascading through models on rate limits.
 * Tries gemini-2.5-flash -> gemini-2.5-flash-lite.
 *
 * @param prompt - The user-facing prompt (exercise context + student data)
 * @param apiKey - Google Gemini API key
 * @param systemInstruction - The persona + tutor rules, sent as systemInstruction
 * @param onChunk - Optional callback for each chunk (for collecting full response)
 * @returns The text stream, the model that served it, and a promise resolving to
 *          token usage once streaming completes.
 */
export async function streamGeminiResponse(
  prompt: string,
  apiKey: string,
  systemInstruction: string,
  onChunk?: (chunk: string) => void
): Promise<GeminiStreamResult> {
  const ai = new GoogleGenAI({ apiKey });
  const { result, model } = await openModelStream(ai, prompt, systemInstruction);

  let resolveUsage: (usage: GeminiUsage | null) => void;
  const usage = new Promise<GeminiUsage | null>((resolve) => {
    resolveUsage = resolve;
  });

  const stream = toTextStream(result, onChunk, (u) => resolveUsage(u));
  return { stream, model, usage };
}
