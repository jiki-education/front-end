"use client";

import { useState, type KeyboardEvent } from "react";
import styles from "./chat-panel.module.css";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = "Type your question here..."
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !disabled) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.chatInputContainer}>
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0 mt-4 relative z-10">
          <div className="absolute bottom-7 left-1/2 -translate-x-1/2 w-px h-[14px] bg-[#e2e8f0] -z-10" />N
        </div>
        <div className="flex-1 relative">
          <textarea
            className={styles.chatInput}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
          />
          <div className={styles.chatInputHint}>
            <span>⌘ ↵</span>
          </div>
        </div>
      </div>
    </div>
  );
}
