import { ChatApiError, ChatRateLimitedError, ChatTokenExpiredError, ChatUsageLimitError } from "./chatApi";
import { ChatTokenError, ChatTokenInvalidCaptchaError } from "./chatTokenApi";

export function formatChatError(error: unknown): string {
  // ChatTokenExpiredError should rarely show (auto-retry handles it)
  if (error instanceof ChatTokenExpiredError) {
    return "Session expired. Please try again.";
  }

  // Quota cap — terminal until the daily/monthly reset. Copy is built from the
  // scope and limit since the proxy intentionally omits a human-readable message.
  if (error instanceof ChatUsageLimitError) {
    const limit = error.scope === "monthly" ? error.usage.monthlyLimit : error.usage.dailyLimit;
    if (error.scope === "monthly") {
      return `You've used all ${limit} messages this month. They reset on the 1st.`;
    }
    return `You've used all ${limit} of today's messages. They reset at midnight UTC.`;
  }

  // Burst throttle — transient. The proxy provides the user-facing copy.
  if (error instanceof ChatRateLimitedError) {
    return error.message;
  }

  // Captcha failure — distinct from access-denied so the user is told to
  // retry rather than nudged to upgrade.
  if (error instanceof ChatTokenInvalidCaptchaError) {
    return "Verification failed. Please try again.";
  }

  // ChatTokenError - errors fetching the token
  if (error instanceof ChatTokenError) {
    if (error.status === 401) {
      return "Authentication failed. Please sign in again.";
    }
    if (error.status && error.status >= 500) {
      return "Server error while initializing chat. Please try again.";
    }
    return "Failed to initialize chat. Please try again.";
  }

  if (error instanceof ChatApiError) {
    if (error.status === 403) {
      // Exercise mismatch - token was for a different exercise
      return "Exercise mismatch. Please refresh and try again.";
    }
    if (error.status === 401) {
      // Check specific error type for better user messaging
      if (error.data && typeof error.data === "object") {
        const errorData = error.data as { error?: string };
        if (errorData.error === "token_expired") {
          // This is shown after auto-retry has failed
          return "Session expired. Please try again.";
        }
        if (errorData.error === "invalid_token") {
          return "Authentication failed. Please sign in again.";
        }
      }
      return "Authentication expired. Please refresh the page.";
    }
    if (error.status === 429) {
      return "Too many requests. Please wait a moment and try again.";
    }
    if (error.status === 503) {
      return "Chat service is temporarily unavailable. Please try again later.";
    }
    if (error.status && error.status >= 500) {
      return "Server error. Please try again in a few moments.";
    }
    return error.message;
  }

  if (error instanceof Error) {
    if (error.message.includes("Failed to fetch")) {
      return "Network error. Please check your connection and try again.";
    }
    if (error.message.includes("timeout")) {
      return "Request timed out. Please try again.";
    }
    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
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
