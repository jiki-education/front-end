import { getApiUrl } from "@/lib/api/config";
import type { SignatureData } from "./chat-types";

export interface ConversationSaveError extends Error {
  endpoint?: string;
  status?: number;
}

export async function saveConversation(
  exerciseSlug: string,
  userMessage: string,
  assistantMessage: string,
  signature: SignatureData
): Promise<void> {
  try {
    // Estimate tokens (rough approximation: 4 chars ≈ 1 token)
    const userMessageTokens = Math.ceil(userMessage.length / 4);
    const assistantMessageTokens = Math.ceil(assistantMessage.length / 4);

    // Save user message
    await saveUserMessage({
      context_type: "lesson",
      context_identifier: exerciseSlug,
      content: userMessage,
      tokens: userMessageTokens
    });

    // Save assistant message with signature
    await saveAssistantMessage({
      context_type: "lesson",
      context_identifier: exerciseSlug,
      content: assistantMessage,
      tokens: assistantMessageTokens,
      timestamp: signature.timestamp,
      signature: signature.signature
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to save conversation:", errorMessage);
    // Don't throw - we don't want to break the UI if save fails
  }
}

async function saveUserMessage(payload: {
  context_type: string;
  context_identifier: string;
  content: string;
  tokens: number;
}): Promise<void> {
  const response = await fetch(getApiUrl("/internal/assistant_conversations/user_messages"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
      // NO Authorization header - cookie sent automatically
    },
    credentials: "include", // CRITICAL: Sends httpOnly cookies
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Failed to save user message: ${response.status} ${response.statusText}`);
  }
}

async function saveAssistantMessage(payload: {
  context_type: string;
  context_identifier: string;
  content: string;
  tokens: number;
  timestamp: string;
  signature: string;
}): Promise<void> {
  const response = await fetch(getApiUrl("/internal/assistant_conversations/assistant_messages"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
      // NO Authorization header - cookie sent automatically
    },
    credentials: "include", // CRITICAL: Sends httpOnly cookies
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Failed to save assistant message: ${response.status} ${response.statusText}`);
  }
}
