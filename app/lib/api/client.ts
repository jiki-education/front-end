/**
 * API Client
 * Simple, type-safe API client for backend communication with JWT support
 */

import { getToken, removeToken } from "@/lib/auth/storage";
import { getApiUrl } from "./config";

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
 * Generic API request handler
 */
async function request<T = unknown>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { body, params, headers = {}, ...restOptions } = options;

  // Build URL with query params
  const url = new URL(getApiUrl(path));
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  // Get auth token
  const token = getToken();

  // Prepare request options
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json"
  };

  // Add custom headers
  Object.entries(headers).forEach(([key, value]) => {
    if (typeof value === "string") {
      requestHeaders[key] = value;
    }
  });

  // Add Authorization header if token exists
  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  const requestOptions: RequestInit = {
    ...restOptions,
    headers: requestHeaders
  };

  // Add body if present
  if (body !== undefined) {
    requestOptions.body = JSON.stringify(body);
  }

  try {
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
      // Handle 401 Unauthorized - clear invalid token
      if (response.status === 401) {
        removeToken();
        // Optionally trigger a re-authentication flow here
      }
      throw new ApiError(response.status, response.statusText, data);
    }

    return {
      data,
      status: response.status,
      headers: response.headers
    };
  } catch (error) {
    // Re-throw ApiError
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError) {
      throw new Error(`Network error: ${error.message}`);
    }

    // Handle other errors
    throw new Error(`Request failed: ${error}`);
  }
}

/**
 * API Client with convenient methods
 */
export const api = {
  get<T = unknown>(path: string, options?: RequestOptions) {
    return request<T>(path, { ...options, method: "GET" });
  },

  post<T = unknown>(path: string, body?: unknown, options?: RequestOptions) {
    return request<T>(path, { ...options, method: "POST", body });
  },

  put<T = unknown>(path: string, body?: unknown, options?: RequestOptions) {
    return request<T>(path, { ...options, method: "PUT", body });
  },

  patch<T = unknown>(path: string, body?: unknown, options?: RequestOptions) {
    return request<T>(path, { ...options, method: "PATCH", body });
  },

  delete<T = unknown>(path: string, options?: RequestOptions) {
    return request<T>(path, { ...options, method: "DELETE" });
  }
};
