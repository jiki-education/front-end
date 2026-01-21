import { getChatApiUrl } from "@/lib/api/config";
import type { ChatMessage, SignatureData, ErrorData } from "./chat-types";

export interface ChatRequestPayload {
  exerciseSlug: string; // The curriculum exercise slug (for LLM proxy)
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

export class ChatTokenExpiredError extends Error {
  constructor(message: string = "Chat token expired") {
    super(message);
    this.name = "ChatTokenExpiredError";
  }
}

export async function sendChatMessage(
  payload: ChatRequestPayload,
  callbacks: StreamCallbacks,
  chatToken: string
): Promise<void> {
  // Truncate history to last 5 messages at the API boundary for clarity
  const truncatedPayload = {
    ...payload,
    history: payload.history.slice(-5)
  };

  await performChatRequest(truncatedPayload, callbacks, chatToken);
}

async function performChatRequest(
  payload: ChatRequestPayload,
  callbacks: StreamCallbacks,
  chatToken: string
): Promise<void> {
  try {
    const response = await fetch(getChatApiUrl("/chat"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${chatToken}`
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

      // Check for token_expired error - let caller handle refresh
      if (response.status === 401 && errorData && typeof errorData === "object") {
        const errorObj = errorData as Record<string, unknown>;
        if (errorObj.error === "token_expired") {
          throw new ChatTokenExpiredError();
        }
      }

      throw new ChatApiError(`HTTP ${response.status}: ${response.statusText}`, response.status, errorData);
    }

    if (!response.body) {
      throw new ChatApiError("No response body received");
    }

    await handleStreamingResponse(response.body, callbacks);
  } catch (error) {
    if (error instanceof ChatApiError || error instanceof ChatTokenExpiredError) {
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
