"use client";

import SendArrow from "@/icons/send-arrow.svg";
import { useChatInput } from "../hooks/useChatInput";
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
  const { message, setMessage, handleSend, handleKeyDown, maxLength, charCount } = useChatInput({
    onSendMessage,
    disabled
  });

  // Surface the counter only as the user nears the limit, so it doesn't clutter
  // the common case of short questions.
  const showCharCount = charCount >= maxLength * 0.8;

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
            maxLength={maxLength}
          />
          {showCharCount && (
            <span className={styles.chatInputCharCount}>
              {charCount}/{maxLength}
            </span>
          )}
          <button type="button" className={styles.chatInputHint} onClick={handleSend} disabled={disabled}>
            <SendArrow />
          </button>
        </div>
      </div>
    </div>
  );
}
