"use client";

import { useContext, useEffect, useRef, useState } from "react";
import OrchestratorContext from "../lib/OrchestratorContext";
import { useChat } from "../lib/useChat";
import { useConversationLoader } from "../lib/useConversationLoader";
// import { useAuthStore } from "@/lib/auth/authStore";
// import { tierIncludes } from "@/lib/pricing";
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
  // const user = useAuthStore((state: any) => state.user);

  if (!orchestrator) {
    return (
      <div className="bg-white h-full flex items-center justify-center">
        <p className="text-sm text-gray-500">Chat unavailable</p>
      </div>
    );
  }

  // Check if user has premium access (premium or max tier)
  // const hasPremiumAccess = user && tierIncludes(user.membership_type, "premium");

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
  // State for mock mode toggle
  const [useMockMode, setUseMockMode] = useState(false);

  const realChat = useChat(orchestrator);
  const mockChat = useMockChat();
  const chat = useMockMode ? mockChat : realChat;

  const conversationLoader = useConversationLoader(chat.context.exerciseSlug);
  const hasLoadedConversationRef = useRef(false);

  // Load conversation on mount (skip if using mock data)
  useEffect(() => {
    if (
      !useMockMode &&
      !conversationLoader.isLoading &&
      conversationLoader.conversation.length > 0 &&
      !hasLoadedConversationRef.current
    ) {
      chat.loadConversation(conversationLoader.conversation);
      hasLoadedConversationRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationLoader.isLoading, conversationLoader.conversation, chat.loadConversation, useMockMode]);

  const hasConversationError = !useMockMode && conversationLoader.error && !conversationLoader.isLoading;

  return (
    <div className="bg-white h-full flex flex-col">
      <PanelHeader {...chatHeader} />

      {!useMockMode && conversationLoader.isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <InlineLoading isAuthenticated={true} />
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          {chat.messages.length > 0 && (
            <div className="border-b border-gray-200 px-4 py-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setUseMockMode(!useMockMode)}
                className={`text-xs px-2 py-1 rounded ${
                  useMockMode
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                Mock {useMockMode ? "ON" : "OFF"}
              </button>
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
                <p className="text-sm text-yellow-800">
                  Failed to load conversation history: {conversationLoader.error}
                </p>
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
