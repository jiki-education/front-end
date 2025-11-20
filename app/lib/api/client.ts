/**
 * API Client
 * Simple, type-safe API client for backend communication with JWT support
 */

import { getAccessToken, parseJwtPayload } from "@/lib/auth/storage";
import { refreshAccessToken } from "@/lib/auth/refresh";
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

export class AuthenticationError extends ApiError {
  constructor(statusText: string, data?: unknown) {
    super(401, statusText, data);
    this.name = "AuthenticationError";
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
  const token = getAccessToken();

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
      // Handle 401 Unauthorized with automatic token refresh
      if (response.status === 401) {
        // Only attempt refresh if token is actually expired
        // This prevents unnecessary refresh token consumption on authorization errors
        const shouldRefresh = isTokenActuallyExpired(token);

        if (shouldRefresh) {
          try {
            const newAccessToken = await refreshAccessToken();

            if (newAccessToken) {
              // Refresh succeeded! Retry the original request with new token
              requestHeaders["Authorization"] = `Bearer ${newAccessToken}`;
              const retryResponse = await fetch(url.toString(), {
                ...requestOptions,
                headers: requestHeaders
              });

              let retryData: T;
              const retryContentType = retryResponse.headers.get("content-type");

              if (retryContentType?.includes("application/json")) {
                retryData = await retryResponse.json();
              } else {
                retryData = (await retryResponse.text()) as T;
              }

              if (!retryResponse.ok) {
                throw new ApiError(retryResponse.status, retryResponse.statusText, retryData);
              }

              return {
                data: retryData,
                status: retryResponse.status,
                headers: retryResponse.headers
              };
            }

            // Refresh failed - tokens already cleared by refresh module
            // Fall through to throw 401 error
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            // Fall through to throw original 401 error
          }
        }
        // If token not expired or refresh failed, throw authentication error
        // This will be caught by components that can handle redirects properly
        throw new AuthenticationError(response.statusText, data);
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
 * Check if token is actually expired to determine if refresh is warranted
 */
function isTokenActuallyExpired(token: string | null): boolean {
  if (!token) {
    return false; // No token means 401 is not due to expiry
  }

  try {
    const payload = parseJwtPayload(token);
    if (!payload || !payload.exp) {
      return false; // Can't determine expiry, assume not expired
    }

    // Check if token has expired (exp is in seconds, Date.now() is in milliseconds)
    const expiryMs = payload.exp * 1000;
    return Date.now() > expiryMs;
  } catch (error) {
    console.error("Failed to check token expiry:", error);
    return false; // Assume not expired on error to avoid unnecessary refresh
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
