import TypeIt from "typeit-react";
import { useTranslations } from "next-intl";
import type { StreamStatus } from "../lib/chat-types";
import { JikiAvatarImg } from "./ChatAvatars";
import { processMessageContent } from "./messageUtils";
import messageStyles from "./ChatMessageItem.module.css";
import styles from "./TypeItAssistantMessage.module.css";

interface TypeItAssistantMessageProps {
  content: string;
  status: StreamStatus;
  typingSpeed?: number;
  onTypingComplete?: () => void;
}

export default function TypeItAssistantMessage({
  content,
  status,
  typingSpeed = 20,
  onTypingComplete
}: TypeItAssistantMessageProps) {
  const t = useTranslations("codingExercise.typeItAssistant");
  // Show thinking state
  if (status === "thinking") {
    return (
      <div className={messageStyles.response}>
        <div className={messageStyles.avatar}>
          <JikiAvatarImg />
        </div>
        <div className={messageStyles.responseContent}>
          <p className={styles.thinkingText}>
            {t("thinking")}
            <span className={styles.thinkingDots} />
          </p>
        </div>
      </div>
    );
  }

  // Show typing or completed message
  return (
    <div className={messageStyles.response}>
      <div className={messageStyles.avatar}>
        <JikiAvatarImg />
      </div>
      <div className={messageStyles.responseContent}>
        {status === "typing" && content ? (
          <TypeIt
            as="div"
            options={{
              strings: [processMessageContent(content)],
              speed: typingSpeed,
              html: true,
              lifeLike: true,
              cursor: false,
              waitUntilVisible: true,
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
