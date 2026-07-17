// Minimal streaming client for OpenRouter's OpenAI-compatible
// chat/completions API, with tool-calling support. BYOK: the key is the
// user's own OpenRouter key, sent directly from the browser.

import { debugLog } from "./debug/debugBus";
import type { ChatCompletionMessage, ChatToolCall } from "./types";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export interface ToolSchema {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

export interface StreamResult {
  text: string;
  toolCalls: ChatToolCall[];
  finishReason: string | null;
}

export class OpenRouterError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

interface StreamOptions {
  apiKey: string;
  model: string;
  messages: ChatCompletionMessage[];
  tools: ToolSchema[];
  onTextDelta: (delta: string) => void;
  signal?: AbortSignal;
}

export async function streamChatCompletion(options: StreamOptions): Promise<StreamResult> {
  debugLog("agent", `request → ${options.model}`, { messageCount: options.messages.length });

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    signal: options.signal,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${options.apiKey}`,
      "HTTP-Referer": "https://jiki.io",
      "X-Title": "Jiki Project Builder (dev)"
    },
    body: JSON.stringify({
      model: options.model,
      messages: options.messages,
      tools: options.tools,
      stream: true,
      stream_options: { include_usage: true }
    })
  });

  if (!response.ok || !response.body) {
    const message = await extractErrorMessage(response);
    debugLog("agent", `error ${response.status}`, message);
    throw new OpenRouterError(response.status, message);
  }

  return readStream(response.body, options.onTextDelta);
}

async function readStream(
  body: ReadableStream<Uint8Array>,
  onTextDelta: (delta: string) => void
): Promise<StreamResult> {
  const reader = body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";
  let text = "";
  let finishReason: string | null = null;
  const toolCallsByIndex = new Map<number, ChatToolCall>();

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) {
        continue;
      }
      const data = trimmed.slice(5).trim();
      if (data === "[DONE]") {
        continue;
      }

      const parsed = parseChunk(data);
      if (!parsed) {
        continue;
      }

      if (parsed.usage) {
        debugLog("agent", "usage", parsed.usage);
      }

      const choice = parsed.choices?.[0];
      if (!choice) {
        continue;
      }
      if (choice.finish_reason) {
        finishReason = choice.finish_reason;
      }

      const delta = choice.delta;
      if (!delta) {
        continue;
      }
      if (delta.content) {
        text += delta.content;
        onTextDelta(delta.content);
      }
      for (const toolDelta of delta.tool_calls ?? []) {
        accumulateToolCall(toolCallsByIndex, toolDelta);
      }
    }
  }

  const toolCalls = [...toolCallsByIndex.entries()].sort(([a], [b]) => a - b).map(([, call]) => call);
  debugLog("agent", `response (${finishReason ?? "?"})`, {
    textLength: text.length,
    toolCalls: toolCalls.map((c) => c.function.name)
  });
  return { text, toolCalls, finishReason };
}

interface StreamChunk {
  usage?: unknown;
  choices?: Array<{
    finish_reason?: string | null;
    delta?: {
      content?: string | null;
      tool_calls?: Array<{
        index: number;
        id?: string;
        function?: { name?: string; arguments?: string };
      }>;
    };
  }>;
}

function parseChunk(data: string): StreamChunk | null {
  try {
    return JSON.parse(data) as StreamChunk;
  } catch {
    return null;
  }
}

function accumulateToolCall(
  byIndex: Map<number, ChatToolCall>,
  delta: { index: number; id?: string; function?: { name?: string; arguments?: string } }
): void {
  const existing = byIndex.get(delta.index) ?? {
    id: "",
    type: "function" as const,
    function: { name: "", arguments: "" }
  };
  if (delta.id) {
    existing.id = delta.id;
  }
  if (delta.function?.name) {
    existing.function.name = delta.function.name;
  }
  if (delta.function?.arguments) {
    existing.function.arguments += delta.function.arguments;
  }
  byIndex.set(delta.index, existing);
}

async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: { message?: string } };
    return body.error?.message ?? `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
}
