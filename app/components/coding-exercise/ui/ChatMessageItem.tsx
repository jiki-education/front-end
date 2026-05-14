import type { ChatMessage } from "../lib/chat-types";
import { processMessageContent } from "./messageUtils";
import { JikiAvatarImg, UserAvatarImg } from "./ChatAvatars";
import styles from "./ChatMessageItem.module.css";

interface ChatMessageItemProps {
  message: ChatMessage;
}

export default function ChatMessageItem({ message }: ChatMessageItemProps) {
  const isUser = message.role === "user";
  const htmlContent = processMessageContent(message.content);

  if (isUser) {
    return (
      <div className={styles.prompt}>
        <div className={styles.avatar}>
          <UserAvatarImg />
        </div>
        <div className={styles.promptContent} dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    );
  }

  return (
    <div className={styles.response}>
      <div className={styles.avatar}>
        <JikiAvatarImg />
      </div>
      <div className={styles.responseContent} dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
}
