"use client";

import { useContext, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import OrchestratorContext from "../lib/OrchestratorContext";
import { useChat } from "../lib/useChat";
import { useConversationLoader } from "../lib/useConversationLoader";
import { useAuthStore } from "@/lib/auth/authStore";
import { tierIncludes } from "@/lib/pricing";
import { ChatLoading } from "./ChatLoading";
import { Conversation } from "./Conversation";
import { ChatInputArea } from "./ChatInputArea";
import { ChatPanelStates, type ChatPanelState } from "./ChatPanelStates";
import type Orchestrator from "../lib/Orchestrator";
import styles from "./ChatPanel.module.css";

export default function ChatPanel() {
  const t = useTranslations("codingExercise.chatPanel");
  const orchestrator = useContext(OrchestratorContext);

  if (!orchestrator) {
    return (
      <div className={styles.unavailable}>
        <p className={styles.unavailableText}>{t("unavailable")}</p>
      </div>
    );
  }

  return <ChatPanelContent orchestrator={orchestrator} />;
}

function ChatPanelContent({ orchestrator }: { orchestrator: Orchestrator }) {
  const user = useAuthStore((state) => state.user);
  const isPremium = user ? tierIncludes(user.membership_type, "premium") : false;

  const chat = useChat(orchestrator);

  const conversationLoader = useConversationLoader(chat.context.context);
  const hasLoadedConversationRef = useRef(false);

  const conversationAllowed = conversationLoader.conversationAllowed;
  const hasExistingConversation = conversationLoader.conversation.length > 0 || chat.messages.length > 0;

  // Load conversation on mount
  useEffect(() => {
    if (
      !conversationLoader.isLoading &&
      conversationLoader.conversation.length > 0 &&
      !hasLoadedConversationRef.current
    ) {
      chat.loadConversation(conversationLoader.conversation);
      hasLoadedConversationRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationLoader.isLoading, conversationLoader.conversation, chat.loadConversation]);

  const chatState = getChatState(isPremium, conversationAllowed, hasExistingConversation);

  return (
    <div className={styles.chatPanel}>
      {conversationLoader.isLoading ? (
        <ChatLoading />
      ) : chatState === "in-progress" ? (
        <Conversation
          messages={chat.messages}
          currentResponse={chat.currentResponse}
          status={chat.status}
          onTypingComplete={chat.finishTyping}
          conversationError={conversationLoader.error}
          onRetryLoad={conversationLoader.retry}
          footer={<ChatInputArea chat={chat} />}
        />
      ) : (
        <ChatPanelStates
          chatState={chatState}
          conversation={conversationLoader.conversation}
          onSendMessage={chat.sendMessage}
        />
      )}
    </div>
  );
}

// Determine which state to render based on the matrix:
// Premium | conversation_allowed | Conversation Exists | Result
// --------|---------------------|---------------------|--------
// Yes     | false               | -                   | PremiumUserBlocked
// Yes     | true                | No                  | CanStart (premium footer)
// Yes     | true                | Yes                 | in-progress conversation
// No      | true                | No                  | CanStart (free footer)
// No      | true                | Yes                 | in-progress conversation
// No      | false               | Yes                 | FreeUserLimitReachedWithHistory
// No      | false               | No                  | FreeUserLimitReached
function getChatState(
  isPremium: boolean,
  conversationAllowed: boolean,
  hasExistingConversation: boolean
): ChatPanelState {
  if (isPremium) {
    if (!conversationAllowed) {
      return "premium-user-blocked";
    }
    if (!hasExistingConversation) {
      return "premium-user-can-start";
    }
    return "in-progress";
  }
  if (conversationAllowed) {
    if (!hasExistingConversation) {
      return "free-user-can-start";
    }
    return "in-progress";
  }
  if (hasExistingConversation) {
    return "free-user-limit-reached-with-history";
  }
  return "free-user-limit-reached";
}
