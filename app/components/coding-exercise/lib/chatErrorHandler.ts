import { ChatApiError } from "./chatApi";

export function formatChatError(error: unknown): string {
  if (error instanceof ChatApiError) {
    if (error.status === 401) {
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
  if (error instanceof ChatApiError) {
    // Retry on server errors and rate limits
    return error.status === 429 || (error.status !== undefined && error.status >= 500);
  }

  if (error instanceof Error) {
    // Retry on network errors
    return error.message.includes("Failed to fetch") || error.message.includes("timeout");
  }

  return false;
}
