"use client";

import { useState, useEffect, useRef, type KeyboardEvent } from "react";
import TypeIt from "typeit-react";
import ChatBubbleIcon from "@/icons/chat-bubble.svg";
import CheckCircleFilledIcon from "@/icons/check-circle-filled.svg";
import sharedStyles from "./FreeUserCanStart.module.css";
import styles from "./PremiumUserCanStart.module.css";

interface PremiumUserCanStartProps {
  onSendMessage: (message: string) => void;
}

const rotatingPhrases = [
  "why your code isn't working",
  "how to fix a bug",
  "what this error means",
  "how to approach this exercise",
  "why this test is failing"
];

// Premium user, conversation allowed, no existing conversation
// Ready to start a new conversation with the chat input
export default function PremiumUserCanStart({ onSendMessage }: PremiumUserCanStartProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasMessage = message.trim().length > 0;

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage) {
      onSendMessage(trimmedMessage);
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSend();
    }
  };

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
        <div className={sharedStyles.avatar}>
          <ChatBubbleIcon width={32} height={32} />
        </div>

        <h3 className={sharedStyles.title}>Feeling Stuck? Talk to Jiki</h3>
        <p className={sharedStyles.description}>
          Ask about...{" "}
          <TypeIt
            as="span"
            className={styles.rotatingText}
            options={{
              strings: rotatingPhrases,
              speed: 50,
              deleteSpeed: 30,
              breakLines: false,
              loop: true,
              nextStringDelay: 2000,
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
          Included in your Premium plan
        </p>
      </div>
    </div>
  );
}
