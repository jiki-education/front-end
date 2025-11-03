import { getToken } from "@/lib/auth/storage";
import type { ChatMessage, SignatureData, ErrorData } from "./chat-types";

export interface ChatRequestPayload {
  exerciseSlug: string;
  code: string;
  question: string;
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
    public status?: number
  ) {
    super(message);
    this.name = "ChatApiError";
  }
}

export async function sendChatMessage(payload: ChatRequestPayload, callbacks: StreamCallbacks): Promise<void> {
  const token = getToken();
  if (!token) {
    throw new ChatApiError("No authentication token available");
  }

  try {
    const response = await fetch("http://localhost:3063/chat", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...payload,
        history: payload.history.slice(-5) // Last 5 messages
      })
    });

    if (!response.ok) {
      throw new ChatApiError(`HTTP ${response.status}: ${response.statusText}`, response.status);
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
          callbacks.onTextChunk(accumulatedText);
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
          accumulatedText += line + "\n";
          callbacks.onTextChunk(accumulatedText);
        }
      }
    }

    // Process any remaining buffer
    if (buffer.trim()) {
      accumulatedText += buffer;
      callbacks.onTextChunk(accumulatedText);
    }

    callbacks.onComplete(accumulatedText.trim(), receivedSignature);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Stream processing error";
    callbacks.onError(message);
    throw new ChatApiError(message);
  }
}
