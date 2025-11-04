"use client";

import { useContext, useEffect, useRef } from "react";
import OrchestratorContext from "../lib/OrchestratorContext";
import { useChat } from "../lib/useChat";
import { useConversationLoader } from "../lib/useConversationLoader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import ChatStatus from "./ChatStatus";
import type Orchestrator from "../lib/Orchestrator";

export default function ChatPanel() {
  const orchestrator = useContext(OrchestratorContext);

  if (!orchestrator) {
    return (
      <div className="bg-white h-full flex items-center justify-center">
        <p className="text-sm text-gray-500">Chat unavailable</p>
      </div>
    );
  }

  return <ChatPanelContent orchestrator={orchestrator} />;
}

function ChatPanelContent({ orchestrator }: { orchestrator: Orchestrator }) {
  const chat = useChat(orchestrator);
  const conversationLoader = useConversationLoader(chat.context.exerciseSlug);
  const hasLoadedConversationRef = useRef(false);

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

  // Show loading state while fetching conversation
  if (conversationLoader.isLoading) {
    return (
      <div className="bg-white h-full flex flex-col">
        <div className="border-b border-gray-200 px-4 py-2">
          <h2 className="text-lg font-semibold text-gray-700">Chat</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Loading conversation...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if conversation loading failed (but don't block the chat entirely)
  const hasConversationError = conversationLoader.error && !conversationLoader.isLoading;

  return (
    <div className="bg-white h-full flex flex-col">
      <div className="border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-700">Chat</h2>
        {chat.messages.length > 0 && (
          <button
            onClick={chat.clearConversation}
            disabled={chat.isDisabled}
            className="text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear
          </button>
        )}
      </div>

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
  );
}
