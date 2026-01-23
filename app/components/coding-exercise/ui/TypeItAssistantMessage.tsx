import TypeIt from "typeit-react";
import type { StreamStatus } from "../lib/chat-types";
import { processMessageContent } from "./messageUtils";
import { processMessageForTyping } from "./processMessageForTyping";
import styles from "./chat-panel.module.css";

interface TypeItAssistantMessageProps {
  content: string;
  status: StreamStatus;
  typingSpeed?: number;
  onTypingComplete?: () => void;
}

export default function TypeItAssistantMessage({
  content,
  status,
  typingSpeed = 50,
  onTypingComplete
}: TypeItAssistantMessageProps) {
  // Show thinking state
  if (status === "thinking") {
    return (
      <div className={styles.response}>
        <div className={styles.avatar}>J</div>
        <div className={styles.responseContent}>
          <p>
            AI is thinking...<span className="animate-pulse">▊</span>
          </p>
        </div>
      </div>
    );
  }

  // Show typing or completed message
  return (
    <div className={styles.response}>
      <div className={styles.avatar}>J</div>
      <div className={styles.responseContent}>
        {status === "typing" && content ? (
          <TypeIt
            options={{
              strings: [processMessageForTyping(content)],
              speed: typingSpeed,
              html: true,
              lifeLike: true,
              cursor: true,
              cursorChar: "|",
              afterComplete: () => {
                onTypingComplete?.();
              }
            }}
          />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: processMessageContent(content) }} />
        )}
      </div>
    </div>
  );
}
