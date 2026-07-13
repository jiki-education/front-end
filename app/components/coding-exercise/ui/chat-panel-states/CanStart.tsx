"use client";

import { useEffect, useRef } from "react";
import TypeIt from "typeit-react";
import ChatBubbleIcon from "@/icons/chat-bubble.svg";
import CheckCircleFilledIcon from "@/icons/check-circle-filled.svg";
import { useChatInput } from "../../hooks/useChatInput";
import sharedStyles from "./shared.module.css";
import styles from "./CanStart.module.css";
import StuckHeader from "./StuckHeader";

interface CanStartProps {
  isFreeUser: boolean;
  onSendMessage: (message: string) => void;
}

const rotatingPhrases = [
  "why your code isn't working",
  "how to fix a bug",
  "what this error means",
  "how to approach this exercise",
  "how to get unstuck"
];

// Conversation allowed, no existing conversation — the chat input is live and
// ready to go. Free users see the same input as premium users; their single
// free conversation is only consumed when they send their first message.
export default function CanStart({ isFreeUser, onSendMessage }: CanStartProps) {
  const { message, setMessage, hasMessage, handleSend, handleKeyDown } = useChatInput({ onSendMessage });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus the input as soon as the panel is shown
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.max(100, textareaRef.current.scrollHeight)}px`;
    }
  }, [message]);

  return (
    <div className={sharedStyles.container}>
      <div className={sharedStyles.content} style={{ width: "100%" }}>
        <StuckHeader />
        <p className={sharedStyles.description}>
          Ask about...{" "}
          <TypeIt
            as="span"
            className={styles.rotatingText}
            options={{
              strings: rotatingPhrases,
              speed: 50,
              deleteSpeed: 30,
              lifeLike: true,
              breakLines: false,
              loop: true,
              // [pause after a string is typed, pause between deletion and the next string]
              nextStringDelay: [2000, 0],
              loopDelay: 1000
            }}
          />
        </p>

        <div className={styles.chatInputContainer}>
          <div className={styles.chatInputWrapper}>
            <textarea
              ref={textareaRef}
              className={styles.chatInput}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question here..."
            />
            <button
              onClick={handleSend}
              disabled={!hasMessage}
              className={`${styles.chatSendButton} ${hasMessage ? styles.chatSendButtonActive : ""}`}
            >
              <ChatBubbleIcon width={16} height={16} />
              Ask Jiki
            </button>
          </div>
        </div>

        <p className={styles.includedText}>
          <CheckCircleFilledIcon width={18} height={18} className={styles.checkIcon} />
          {isFreeUser ? (
            "First conversation included in your Free plan"
          ) : (
            <>
              Included in your <span className={sharedStyles.premiumText}>Premium</span> plan
            </>
          )}
        </p>
      </div>
    </div>
  );
}
