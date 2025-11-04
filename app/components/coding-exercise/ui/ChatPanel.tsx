"use client";

import { useContext } from "react";
import OrchestratorContext from "../lib/OrchestratorContext";
import { useChat } from "../lib/useChat";
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
