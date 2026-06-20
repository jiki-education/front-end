import { useState, type KeyboardEvent } from "react";
import { MAX_CHAT_MESSAGE_LENGTH } from "../lib/chat-types";

interface UseChatInputOptions {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  maxLength?: number;
}

export function useChatInput({
  onSendMessage,
  disabled = false,
  // Mirrors the proxy's QUESTION_MAX_LENGTH; re-enforced when sending (see
  // sendChatMessage) so DevTools tampering can't bypass it.
  maxLength = MAX_CHAT_MESSAGE_LENGTH
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
