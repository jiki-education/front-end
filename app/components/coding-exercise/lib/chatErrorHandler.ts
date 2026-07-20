import { ChatApiError, ChatRateLimitedError, ChatTokenExpiredError, ChatUsageLimitError } from "./chatApi";
import { ChatTokenError, ChatTokenInvalidCaptchaError } from "./chatTokenApi";

// Message keys relative to the `codingExercise` namespace. The caller (useChat)
// translates with `useTranslations("codingExercise")`, so next-intl's typed `t`
// validates every member of this union against the catalog.
// The usage-limit entries reuse the ChatUsageNotice cap copy — same meaning,
// same message.
export type ChatErrorKey =
  | "chatError.sessionExpired"
  | "chatError.verificationFailed"
  | "chatError.authFailed"
  | "chatError.tokenServerError"
  | "chatError.tokenInitFailed"
  | "chatError.exerciseMismatch"
  | "chatError.authExpired"
  | "chatError.tooManyRequests"
  | "chatError.serviceUnavailable"
  | "chatError.serverError"
  | "chatError.networkError"
  | "chatError.timeout"
  | "chatError.unexpected"
  | "chatUsageNotice.limitReached.daily"
  | "chatUsageNotice.limitReached.monthly";

// The translatable result of classifying a chat error: either a catalog key
// (plus ICU params) for copy we own, or verbatim text for copy the proxy/server
// provides pre-formatted.
export type ChatErrorMessage =
  | { type: "key"; key: ChatErrorKey; params?: Record<string, string | number> }
  | { type: "text"; text: string };

function key(k: ChatErrorKey, params?: Record<string, string | number>): ChatErrorMessage {
  return { type: "key", key: k, params };
}

export function formatChatError(error: unknown): ChatErrorMessage {
  // ChatTokenExpiredError should rarely show (auto-retry handles it)
  if (error instanceof ChatTokenExpiredError) {
    return key("chatError.sessionExpired");
  }

  // Quota cap — terminal until the daily/monthly reset. Copy is built from the
  // scope and limit since the proxy intentionally omits a human-readable message.
  if (error instanceof ChatUsageLimitError) {
    const limit = error.scope === "monthly" ? error.usage.monthlyLimit : error.usage.dailyLimit;
    return key(
      error.scope === "monthly" ? "chatUsageNotice.limitReached.monthly" : "chatUsageNotice.limitReached.daily",
      { limit }
    );
  }

  // Burst throttle — transient. The proxy provides the user-facing copy, so it
  // passes through untranslated.
  if (error instanceof ChatRateLimitedError) {
    return { type: "text", text: error.message };
  }

  // Captcha failure — distinct from access-denied so the user is told to
  // retry rather than nudged to upgrade.
  if (error instanceof ChatTokenInvalidCaptchaError) {
    return key("chatError.verificationFailed");
  }

  // ChatTokenError - errors fetching the token
  if (error instanceof ChatTokenError) {
    if (error.status === 401) {
      return key("chatError.authFailed");
    }
    if (error.status && error.status >= 500) {
      return key("chatError.tokenServerError");
    }
    return key("chatError.tokenInitFailed");
  }

  if (error instanceof ChatApiError) {
    if (error.status === 403) {
      // Exercise mismatch - token was for a different exercise
      return key("chatError.exerciseMismatch");
    }
    if (error.status === 401) {
      // Check specific error type for better user messaging
      if (error.data && typeof error.data === "object") {
        const errorData = error.data as { error?: string };
        if (errorData.error === "token_expired") {
          // This is shown after auto-retry has failed
          return key("chatError.sessionExpired");
        }
        if (errorData.error === "invalid_token") {
          return key("chatError.authFailed");
        }
      }
      return key("chatError.authExpired");
    }
    if (error.status === 429) {
      return key("chatError.tooManyRequests");
    }
    if (error.status === 503) {
      return key("chatError.serviceUnavailable");
    }
    if (error.status && error.status >= 500) {
      return key("chatError.serverError");
    }
    // Server-provided message for statuses we don't classify — passes through.
    return { type: "text", text: error.message };
  }

  if (error instanceof Error) {
    if (error.message.includes("Failed to fetch")) {
      return key("chatError.networkError");
    }
    if (error.message.includes("timeout")) {
      return key("chatError.timeout");
    }
    // Unclassified runtime error — relay its own message verbatim.
    return { type: "text", text: error.message };
  }

  return key("chatError.unexpected");
}

export function shouldRetryError(error: unknown): boolean {
  // Neither quota caps nor burst throttles should be auto-retried: a cap won't
  // recover until reset, and retrying a throttle just prolongs it.
  if (error instanceof ChatUsageLimitError || error instanceof ChatRateLimitedError) {
    return false;
  }

  if (error instanceof ChatApiError) {
    // Don't retry expired tokens - they should be handled by refresh logic
    if (error.status === 401 && error.data && typeof error.data === "object") {
      const errorData = error.data as { error?: string };
      if (errorData.error === "token_expired") {
        return false; // Refresh logic handles this
      }
    }

    // Retry on server errors and rate limits
    return error.status === 429 || (error.status !== undefined && error.status >= 500);
  }

  if (error instanceof Error) {
    // Retry on network errors
    return error.message.includes("Failed to fetch") || error.message.includes("timeout");
  }

  return false;
}
