import { getAccessToken } from "@/lib/auth/storage";
import { refreshAccessToken } from "@/lib/auth/refresh";
import { getChatApiUrl } from "@/lib/api/config";
import type { ChatMessage, SignatureData, ErrorData } from "./chat-types";

export interface ChatRequestPayload {
  exerciseSlug: string;
  code: string;
  question: string;
  language: string;
  history: ChatMessage[];
  nextTaskId?: string;
}

export interface StreamCallbacks {
  onTextChunk: (text: string) => void;
  onSignature: (signature: SignatureData) => void;
  onError: (error: string) => void;
  onComplete: (fullResponse: string, signature: SignatureData | null) => void;
}

export class ChatApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = "ChatApiError";
  }
}

export async function sendChatMessage(payload: ChatRequestPayload, callbacks: StreamCallbacks): Promise<void> {
  // Truncate history to last 5 messages at the API boundary for clarity
  const truncatedPayload = {
    ...payload,
    history: payload.history.slice(-5)
  };

  try {
    await performChatRequest(truncatedPayload, callbacks);
  } catch (error) {
    if (error instanceof ChatApiError && error.status === 401 && error.data) {
      // Check if this is a token_expired error that we can refresh
      const errorData = error.data as any;
      if (errorData?.error === "token_expired") {
        // Attempt token refresh
        const newToken = await refreshAccessToken();
        if (newToken) {
          // Retry with the new token directly to avoid redundant storage round-trip
          await performChatRequest(truncatedPayload, callbacks, newToken);
          return;
        }
        // If refresh failed, the refresh module already cleared tokens
        // Fall through to throw the original error
      }
    }
    throw error;
  }
}

async function performChatRequest(
  payload: ChatRequestPayload,
  callbacks: StreamCallbacks,
  token?: string
): Promise<void> {
  const authToken = token || getAccessToken();
  if (!authToken) {
    throw new ChatApiError("No authentication token available");
  }

  try {
    const response = await fetch(getChatApiUrl("/chat"), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      // Parse error response to get detailed error info
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

      throw new ChatApiError(`HTTP ${response.status}: ${response.statusText}`, response.status, errorData);
    }

    if (!response.body) {
      throw new ChatApiError("No response body received");
    }

    await handleStreamingResponse(response.body, callbacks);
  } catch (error) {
    if (error instanceof ChatApiError) {
      throw error;
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new ChatApiError(message);
  }
}

async function handleStreamingResponse(body: ReadableStream<Uint8Array>, callbacks: StreamCallbacks): Promise<void> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let accumulatedText = "";
  let buffer = "";
  let receivedSignature: SignatureData | null = null;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;

      // Check for "data: " markers in the buffer
      let dataIndex = buffer.indexOf("data: ");

      while (dataIndex !== -1) {
        // If there's text before "data: ", it's part of the response
        if (dataIndex > 0) {
          const textBeforeData = buffer.substring(0, dataIndex);
          accumulatedText += textBeforeData;
          callbacks.onTextChunk(textBeforeData); // Pass only the new chunk
        }

        // Find the end of this data line (look for next newline)
        const endOfLine = buffer.indexOf("\n", dataIndex);
        if (endOfLine === -1) {
          // Incomplete data line, keep in buffer
          buffer = buffer.substring(dataIndex);
          break;
        }

        // Extract the data line
        const dataLine = buffer.substring(dataIndex + 6, endOfLine); // +6 to skip "data: "

        // Try to parse as JSON
        try {
          const data = JSON.parse(dataLine);

          if (data.type === "signature") {
            receivedSignature = data as SignatureData;
            callbacks.onSignature(receivedSignature);
          } else if (data.type === "error") {
            const errorData = data as ErrorData;
            callbacks.onError(errorData.message);
            return;
          }
        } catch {
          // Not valid JSON, might be malformed
          console.error("Failed to parse SSE data:", dataLine);
        }

        // Move past this data line
        buffer = buffer.substring(endOfLine + 1);
        dataIndex = buffer.indexOf("data: ");
      }

      // Any remaining buffer is text
      if (buffer && !buffer.startsWith("data: ")) {
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          const lineWithNewline = line + "\n";
          accumulatedText += lineWithNewline;
          callbacks.onTextChunk(lineWithNewline); // Pass only the new chunk
        }
      }
    }

    // Process any remaining buffer
    if (buffer.trim()) {
      accumulatedText += buffer;
      callbacks.onTextChunk(buffer); // Pass only the new chunk
    }

    callbacks.onComplete(accumulatedText.trim(), receivedSignature);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Stream processing error";
    callbacks.onError(message);
    throw new ChatApiError(message);
  }
}
