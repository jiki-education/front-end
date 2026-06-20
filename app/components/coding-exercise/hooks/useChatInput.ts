import { useState, type KeyboardEvent } from "react";

// Matches the proxy's QUESTION_MAX_LENGTH (1000 chars). Enforcing the same limit
// client-side means users get inline feedback instead of an opaque server-side
// rejection. Keep these two values in sync.
export const DEFAULT_MAX_QUESTION_LENGTH = 1000;

interface UseChatInputOptions {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  maxLength?: number;
}

export function useChatInput({
  onSendMessage,
  disabled = false,
  maxLength = DEFAULT_MAX_QUESTION_LENGTH
}: UseChatInputOptions) {
  const [message, setMessage] = useState("");

  const hasMessage = message.trim().length > 0;

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage("");
    }
  };

  // Enter sends; Shift+Enter inserts a newline
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !disabled) {
      e.preventDefault();
      handleSend();
    }
  };

  return { message, setMessage, hasMessage, handleSend, handleKeyDown, maxLength, charCount: message.length };
}
