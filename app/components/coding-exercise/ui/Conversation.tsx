import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import type { ChatMessage, StreamStatus } from "../lib/chat-types";
import ChatMessages from "./ChatMessages";
import { ChatHeader } from "./ChatHeader";
import styles from "./Conversation.module.css";

interface ConversationProps {
  messages: ChatMessage[];
  currentResponse?: string;
  status?: StreamStatus;
  onTypingComplete?: () => void;
  conversationError?: string | null;
  onRetryLoad?: () => void;
  footer: ReactNode;
}

// The conversation view: header + scrolling message list, with a swappable footer
// (the live input for an active conversation, or a locked-state message).
export function Conversation({
  messages,
  currentResponse = "",
  status = "idle",
  onTypingComplete,
  conversationError,
  onRetryLoad,
  footer
}: ConversationProps) {
  const t = useTranslations("codingExercise.conversation");
  const tCommon = useTranslations("common");
  return (
    <div className={styles.conversation}>
      {conversationError && (
        <div className={styles.errorBanner}>
          <div className={styles.errorBannerRow}>
            <p className={styles.errorBannerText}>{t("loadError", { error: conversationError })}</p>
            {onRetryLoad && (
              <button onClick={onRetryLoad} className={styles.errorBannerRetry}>
                {tCommon("retry")}
              </button>
            )}
          </div>
        </div>
      )}

      <ChatMessages
        messages={messages}
        currentResponse={currentResponse}
        status={status}
        onTypingComplete={onTypingComplete}
        header={<ChatHeader />}
      />

      {footer}
    </div>
  );
}
