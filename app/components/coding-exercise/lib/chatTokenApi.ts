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

export interface FetchChatTokenParams {
  context: ExerciseContext;
}

export interface ChatTokenResponse {
  token: string;
}

export async function fetchChatToken(params: FetchChatTokenParams): Promise<string> {
  const { context } = params;
  const body = context.type === "project" ? { project_slug: context.slug } : { lesson_slug: context.slug };

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

    throw new ChatTokenError(`HTTP ${response.status}: ${response.statusText}`, response.status, errorData);
  }

  const data = (await response.json()) as ChatTokenResponse;
  return data.token;
}
