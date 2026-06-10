import { useState, type KeyboardEvent } from "react";

interface UseChatInputOptions {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function useChatInput({ onSendMessage, disabled = false }: UseChatInputOptions) {
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

  return { message, setMessage, hasMessage, handleSend, handleKeyDown };
}
