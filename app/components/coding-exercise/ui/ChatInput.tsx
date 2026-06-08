"use client";

import { useState, type KeyboardEvent } from "react";
import SendArrow from "@/icons/send-arrow.svg";
import { UserAvatarImg } from "./ChatAvatars";
import styles from "./ChatInput.module.css";

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
    // Enter sends; Shift+Enter inserts a newline
    if (e.key === "Enter" && !e.shiftKey && !disabled) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.chatInputContainer}>
      <div className={styles.chatInputRow}>
        <div className={styles.chatInputAvatar}>
          <div className={styles.chatInputAvatarLine} />
          <UserAvatarImg className={styles.chatInputAvatarImg} />
        </div>
        <div className={styles.chatInputField}>
          <textarea
            autoFocus
            className={styles.chatInput}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
          />
          <button type="button" className={styles.chatInputHint} onClick={handleSend} disabled={disabled}>
            <SendArrow />
          </button>
        </div>
      </div>
    </div>
  );
}
