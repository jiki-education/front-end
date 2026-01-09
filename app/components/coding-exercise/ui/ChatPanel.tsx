"use client";

import { useContext, useEffect, useRef } from "react";
import OrchestratorContext from "../lib/OrchestratorContext";
import { useChat } from "../lib/useChat";
import { useConversationLoader } from "../lib/useConversationLoader";
import { useAuthStore } from "@/lib/auth/authStore";
import { tierIncludes } from "@/lib/pricing";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import ChatStatus from "./ChatStatus";
// import ChatPremiumUpgrade from "./ChatPremiumUpgrade";
import type Orchestrator from "../lib/Orchestrator";
import ChatIcon from "@/icons/chat.svg";
import { PanelHeader } from "./PanelHeader";
import { InlineLoading } from "@/components/concepts/LoadingStates";
import { useMockChat } from "../lib/useMockChat";

export default function ChatPanel() {
  const orchestrator = useContext(OrchestratorContext);
  const user = useAuthStore((state: any) => state.user);

  if (!orchestrator) {
    return (
      <div className="bg-white h-full flex items-center justify-center">
        <p className="text-sm text-gray-500">Chat unavailable</p>
      </div>
    );
  }

  // Check if user has premium access (premium or max tier)
  const hasPremiumAccess = user && tierIncludes(user.membership_type, "premium");

  // if (!hasPremiumAccess) {
  //   return <ChatPremiumUpgrade />;
  // }

  return <ChatPanelContent orchestrator={orchestrator} />;
}

const chatHeader = {
  title: "Talk to Jiki",
  description: "Ask questions and get help from your AI coding assistant",
  icon: <ChatIcon width={42} height={42} />
};

function ChatPanelContent({ orchestrator }: { orchestrator: Orchestrator }) {
  // Toggle this to use mock data for styling
  const USE_MOCK_DATA = process.env.NODE_ENV === "development";
  
  const realChat = useChat(orchestrator);
  const mockChat = useMockChat();
  const chat = USE_MOCK_DATA ? mockChat : realChat;
  
  const conversationLoader = useConversationLoader(chat.context.exerciseSlug);
  const hasLoadedConversationRef = useRef(false);

  // Load conversation on mount (skip if using mock data)
  useEffect(() => {
    if (
      !USE_MOCK_DATA &&
      !conversationLoader.isLoading &&
      conversationLoader.conversation.length > 0 &&
      !hasLoadedConversationRef.current
    ) {
      chat.loadConversation(conversationLoader.conversation);
      hasLoadedConversationRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationLoader.isLoading, conversationLoader.conversation, chat.loadConversation, USE_MOCK_DATA]);

  const hasConversationError = !USE_MOCK_DATA && conversationLoader.error && !conversationLoader.isLoading;

  return (
    <div className="bg-white h-full flex flex-col">
      <PanelHeader {...chatHeader} />
      
      {!USE_MOCK_DATA && conversationLoader.isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <InlineLoading isAuthenticated={true} />
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          {chat.messages.length > 0 && (
            <div className="border-b border-gray-200 px-4 py-2 flex items-center justify-end">
              <button
                onClick={chat.clearConversation}
                disabled={chat.isDisabled}
                className="text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear
              </button>
            </div>
          )}

          {hasConversationError && (
            <div className="px-4 py-2 bg-yellow-50 border-b border-yellow-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-yellow-800">Failed to load conversation history: {conversationLoader.error}</p>
                <button
                  onClick={conversationLoader.retry}
                  className="text-xs text-yellow-600 hover:text-yellow-800 underline"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          <ChatMessages
            messages={chat.messages}
            currentResponse={chat.currentResponse}
            status={chat.status}
            onTypingComplete={chat.finishTyping}
          />

          <ChatStatus
            status={chat.status}
            error={chat.error}
            onRetry={chat.retryLastMessage}
            onClearError={chat.clearError}
            canRetry={chat.canRetry}
          />

          <ChatInput onSendMessage={chat.sendMessage} disabled={chat.isDisabled} />
        </div>
      )}
    </div>
  );
}
