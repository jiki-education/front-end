"use client";

/**
 * API Client
 * Simple, type-safe API client for backend communication with session cookie support
 */

import { getApiUrl } from "./config";
import { clearCriticalError, setCriticalError, useErrorHandlerStore } from "./errorHandlerStore";

// Retry configuration
const INITIAL_RETRY_DELAY_MS = 50;
const MAX_RETRY_DELAY_MS = 5000;
const SHOW_MODAL_AFTER_MS = 1000;

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: unknown
  ) {
    super(`API Error: ${status} ${statusText}`);
    this.name = "ApiError";
  }
}

export class AuthenticationError extends ApiError {
  constructor(statusText: string, data?: unknown) {
    super(401, statusText, data);
    this.name = "AuthenticationError";
  }
}

export class NetworkError extends Error {
  constructor(
    message: string,
    public originalError?: Error
  ) {
    super(`Network error: ${message}`);
    this.name = "NetworkError";
  }
}

export class RateLimitError extends ApiError {
  constructor(
    statusText: string,
    public retryAfterSeconds: number,
    data?: unknown
  ) {
    super(429, statusText, data);
    this.name = "RateLimitError";
  }
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  params?: Record<string, string | number | boolean>;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  headers: Headers;
}

/**
 * Helper function to sleep for a specified duration
 */
async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate exponential backoff delay (capped at max)
 */
function calculateBackoffDelay(attempt: number): number {
  return Math.min(INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt), MAX_RETRY_DELAY_MS);
}

/**
 * Parse Retry-After header (supports both seconds and HTTP date)
 */
function parseRetryAfter(retryAfterHeader: string | null): number {
  if (!retryAfterHeader) {
    return 60; // Default to 60 seconds if header missing
  }

  // Try parsing as seconds (numeric)
  const seconds = parseInt(retryAfterHeader, 10);
  if (!isNaN(seconds)) {
    return seconds;
  }

  // Try parsing as HTTP date
  try {
    const retryDate = new Date(retryAfterHeader);
    const now = new Date();
    const diffSeconds = Math.ceil((retryDate.getTime() - now.getTime()) / 1000);
    return Math.max(diffSeconds, 0); // Don't return negative
  } catch {
    return 60; // Default to 60 seconds if parsing fails
  }
}

/**
 * Retry a function with infinite backoff
 * Handles network errors, auth errors, and rate limiting
 */
async function retryWithExponentialBackoff<T>(fn: () => Promise<T>): Promise<T> {
  const startTime = Date.now();
  let attempt = 0;

  while (true) {
    // Infinite loop - never give up!
    try {
      const result = await fn();

      // Success! Clear any error that was shown
      clearCriticalError();

      return result;
    } catch (error) {
      // Authentication error - show modal and hang forever
      if (error instanceof AuthenticationError) {
        setCriticalError(error);
        await new Promise(() => {}); // Hang forever, never resolves
      }

      // Rate limit error - show modal, wait specified time, retry
      if (error instanceof RateLimitError) {
        setCriticalError(error);
        await sleep(error.retryAfterSeconds * 1000); // Convert to milliseconds
        attempt = 0; // Reset attempt counter after rate limit
        continue; // Retry immediately (modal clears on success at line 119)
      }

      // Non-network errors (404, 500, validation) - throw immediately
      if (!(error instanceof TypeError)) {
        throw error;
      }

      // Network error - show modal after 1s, retry infinitely
      const elapsedTime = Date.now() - startTime;
      const currentError = useErrorHandlerStore.getState().criticalError;

      if (!currentError && elapsedTime >= SHOW_MODAL_AFTER_MS) {
        setCriticalError(new NetworkError("Connection lost"));
      }

      const delay = calculateBackoffDelay(attempt);
      await sleep(delay);
      attempt++;
    }
  }
}

/**
 * Generic API request handler
 */
async function request<T = unknown>(
  path: string,
  options: RequestOptions = {},
  useRetries: boolean = true
): Promise<ApiResponse<T>> {
  const { body, params, headers = {}, ...restOptions } = options;

  // Build URL with query params
  const url = new URL(getApiUrl(path));
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  // Prepare request options (NO TOKEN ACCESS - cookies sent automatically)
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json"
  };

  // Add custom headers
  Object.entries(headers).forEach(([key, value]) => {
    if (typeof value === "string") {
      requestHeaders[key] = value;
    }
  });

  const requestOptions: RequestInit = {
    ...restOptions,
    headers: requestHeaders,
    credentials: "include" // CRITICAL: Send cookies with requests
  };

  // Add body if present
  if (body !== undefined) {
    requestOptions.body = JSON.stringify(body);
  }

  // Define the fetch function
  const performFetch = async (): Promise<ApiResponse<T>> => {
    const response = await fetch(url.toString(), requestOptions);

    // Parse response
    let data: T;
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      data = (await response.text()) as T;
    }

    // Handle error responses
    if (!response.ok) {
      // Handle 429 Rate Limit
      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After");
        const retryAfterSeconds = parseRetryAfter(retryAfter);
        throw new RateLimitError(response.statusText, retryAfterSeconds, data);
      }

      // Handle 401 Unauthorized - session invalid, needs re-login
      if (response.status === 401) {
        throw new AuthenticationError(response.statusText, data);
      }

      throw new ApiError(response.status, response.statusText, data);
    }

    return {
      data,
      status: response.status,
      headers: response.headers
    };
  };

  try {
    // Either use retries or call directly
    if (useRetries) {
      return await retryWithExponentialBackoff(performFetch);
    }
    return await performFetch();
  } catch (error) {
    // Re-throw ApiError (including AuthenticationError) and NetworkError
    if (error instanceof ApiError || error instanceof NetworkError) {
      throw error;
    }

    // Convert network errors (TypeError from fetch) to NetworkError
    if (error instanceof TypeError) {
      throw new NetworkError(error.message, error);
    }

    // Handle other errors (shouldn't happen, but keep as fallback)
    throw new Error(`Request failed: ${error}`);
  }
}

/**
 * API Client with convenient methods
 */
export const api = {
  get<T = unknown>(path: string, options?: RequestOptions, useRetries?: boolean) {
    return request<T>(path, { ...options, method: "GET" }, useRetries);
  },

  post<T = unknown>(path: string, body?: unknown, options?: RequestOptions, useRetries?: boolean) {
    return request<T>(path, { ...options, method: "POST", body }, useRetries);
  },

  put<T = unknown>(path: string, body?: unknown, options?: RequestOptions, useRetries?: boolean) {
    return request<T>(path, { ...options, method: "PUT", body }, useRetries);
  },

  patch<T = unknown>(path: string, body?: unknown, options?: RequestOptions, useRetries?: boolean) {
    return request<T>(path, { ...options, method: "PATCH", body }, useRetries);
  },

  delete<T = unknown>(path: string, options?: RequestOptions, useRetries?: boolean) {
    return request<T>(path, { ...options, method: "DELETE" }, useRetries);
  }
};
