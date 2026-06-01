import { getApiUrl } from "@/lib/api/config";
import type { ExerciseContext } from "./types";

export class ChatTokenError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = "ChatTokenError";
  }
}

// 403 with error.type === "access_denied": user isn't entitled to chat
// (free user past their free conversation, premium past fair-use, etc.).
// Distinct from ChatTokenInvalidCaptchaError so analytics/UX can branch.
export class ChatTokenAccessDeniedError extends ChatTokenError {
  constructor(message: string, data?: unknown) {
    super(message, 403, data);
    this.name = "ChatTokenAccessDeniedError";
  }
}

// 403 with error.type === "invalid_captcha": Cloudflare Turnstile token
// failed verification. Infra failure, not a product event — never fire
// premium_modal_shown on this path or the funnel data is corrupted.
export class ChatTokenInvalidCaptchaError extends ChatTokenError {
  constructor(message: string, data?: unknown) {
    super(message, 403, data);
    this.name = "ChatTokenInvalidCaptchaError";
  }
}

export interface FetchChatTokenParams {
  context: ExerciseContext;
  cfTurnstileResponse: string;
}

export interface ChatTokenResponse {
  token: string;
}

export async function fetchChatToken(params: FetchChatTokenParams): Promise<string> {
  const { context, cfTurnstileResponse } = params;
  const slug = context.type === "project" ? { project_slug: context.slug } : { lesson_slug: context.slug };
  const body = { ...slug, cf_turnstile_response: cfTurnstileResponse };

  const response = await fetch(getApiUrl("/internal/assistant_conversations"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(body)
  });

  if (!response.ok) {
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

    if (response.status === 403) {
      const errorType = extractErrorType(errorData);
      const message = extractErrorMessage(errorData) ?? `HTTP 403: ${response.statusText}`;
      if (errorType === "access_denied") {
        throw new ChatTokenAccessDeniedError(message, errorData);
      }
      if (errorType === "invalid_captcha") {
        throw new ChatTokenInvalidCaptchaError(message, errorData);
      }
    }

    throw new ChatTokenError(`HTTP ${response.status}: ${response.statusText}`, response.status, errorData);
  }

  const data = (await response.json()) as ChatTokenResponse;
  return data.token;
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
