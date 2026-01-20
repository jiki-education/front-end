import { getApiUrl } from "@/lib/api/config";
import { refreshAccessToken } from "@/lib/auth/refresh";

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

export interface FetchChatTokenParams {
  lessonSlug: string;
  exerciseSlug: string;
}

export interface ChatTokenResponse {
  token: string;
}

export async function fetchChatToken(params: FetchChatTokenParams): Promise<string> {
  return performTokenRequest(params, 0);
}

async function performTokenRequest(params: FetchChatTokenParams, attempt: number): Promise<string> {
  const response = await fetch(getApiUrl("/internal/assistant_conversations"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include", // Session cookie auth
    body: JSON.stringify({
      lessonSlug: params.lessonSlug,
      exerciseSlug: params.exerciseSlug
    })
  });

  if (!response.ok) {
    // Handle 401 with session refresh (but only retry once)
    if (response.status === 401 && attempt < 1) {
      const refreshResult = await refreshAccessToken();
      if (refreshResult) {
        return performTokenRequest(params, attempt + 1);
      }
    }

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

    throw new ChatTokenError(`HTTP ${response.status}: ${response.statusText}`, response.status, errorData);
  }

  const data = (await response.json()) as ChatTokenResponse;
  return data.token;
}
