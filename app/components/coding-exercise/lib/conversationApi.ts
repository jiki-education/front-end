import { getApiUrl } from "@/lib/api/config";
import type { SignatureData } from "./chat-types";
import type { ExerciseContext } from "./types";

export class ConversationSaveError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = "ConversationSaveError";
  }
}

// 403 with error.type === "invalid_captcha": the persistence endpoint
// rejected the request as a bot. Surfaced distinctly so the user sees a
// "verification failed" message rather than a generic save error.
export class ConversationSaveCaptchaError extends ConversationSaveError {
  constructor(message: string, data?: unknown) {
    super(message, 403, data);
    this.name = "ConversationSaveCaptchaError";
  }
}

export async function saveConversation(
  context: ExerciseContext,
  userMessage: string,
  assistantMessage: string,
  signature: SignatureData
): Promise<void> {
  // Estimate tokens (rough approximation: 4 chars ≈ 1 token)
  const userMessageTokens = Math.ceil(userMessage.length / 4);
  const assistantMessageTokens = Math.ceil(assistantMessage.length / 4);

  await saveUserMessage({
    context_type: context.type,
    context_identifier: context.slug,
    content: userMessage,
    tokens: userMessageTokens
  });

  await saveAssistantMessage({
    context_type: context.type,
    context_identifier: context.slug,
    content: assistantMessage,
    tokens: assistantMessageTokens,
    timestamp: signature.timestamp,
    signature: signature.signature
  });
}

async function saveUserMessage(payload: {
  context_type: string;
  context_identifier: string;
  content: string;
  tokens: number;
}): Promise<void> {
  const response = await fetch(getApiUrl("/internal/assistant_conversations/user_messages"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
      // NO Authorization header - cookie sent automatically
    },
    credentials: "include", // CRITICAL: Sends httpOnly cookies
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    await throwForResponse(response, "Failed to save user message");
  }
}

async function saveAssistantMessage(payload: {
  context_type: string;
  context_identifier: string;
  content: string;
  tokens: number;
  timestamp: string;
  signature: string;
}): Promise<void> {
  const response = await fetch(getApiUrl("/internal/assistant_conversations/assistant_messages"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
      // NO Authorization header - cookie sent automatically
    },
    credentials: "include", // CRITICAL: Sends httpOnly cookies
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    await throwForResponse(response, "Failed to save assistant message");
  }
}

async function throwForResponse(response: Response, fallback: string): Promise<never> {
  let errorData: unknown;
  try {
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      errorData = await response.json();
    } else {
      errorData = await response.text();
    }
  } catch {
    errorData = { error: "unknown", message: "Failed to parse error response" };
  }

  if (response.status === 403 && extractErrorType(errorData) === "invalid_captcha") {
    const message = extractErrorMessage(errorData) ?? "Verification failed.";
    throw new ConversationSaveCaptchaError(message, errorData);
  }

  throw new ConversationSaveError(
    `${fallback}: HTTP ${response.status} ${response.statusText}`,
    response.status,
    errorData
  );
}

function extractErrorType(data: unknown): string | undefined {
  if (typeof data !== "object" || data === null) return undefined;
  const errorField = (data as { error?: unknown }).error;
  if (typeof errorField !== "object" || errorField === null) return undefined;
  const type = (errorField as { type?: unknown }).type;
  return typeof type === "string" ? type : undefined;
}

function extractErrorMessage(data: unknown): string | undefined {
  if (typeof data !== "object" || data === null) return undefined;
  const errorField = (data as { error?: unknown }).error;
  if (typeof errorField !== "object" || errorField === null) return undefined;
  const message = (errorField as { message?: unknown }).message;
  return typeof message === "string" ? message : undefined;
}
