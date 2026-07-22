"use client";

import { useState } from "react";
import { ChatPanelStates, type ChatPanelState } from "@/components/coding-exercise/ui/ChatPanelStates";
import { ChatLoading } from "@/components/coding-exercise/ui/ChatLoading";
import { Conversation } from "@/components/coding-exercise/ui/Conversation";
import { ChatInputArea } from "@/components/coding-exercise/ui/ChatInputArea";
import type { ChatMessage } from "@/components/coding-exercise/lib/chat-types";
import type { useChat } from "@/components/coding-exercise/lib/useChat";

type StateId = ChatPanelState | "loading";

const states: { id: StateId; label: string }[] = [
  { id: "loading", label: "Loading" },
  { id: "free-user-can-start", label: "Free User Can Start" },
  { id: "free-user-limit-reached", label: "Free User Limit Reached" },
  { id: "free-user-limit-reached-with-history", label: "Free User Limit Reached (With History)" },
  { id: "premium-user-blocked", label: "Premium User Blocked" },
  { id: "premium-user-can-start", label: "Premium User Can Start" },
  { id: "in-progress", label: "In Progress Conversation" }
];

const mockMessages: ChatMessage[] = [
  {
    role: "user",
    content: "Why isn't my `forEach` loop moving the aliens?"
  },
  {
    role: "assistant",
    content:
      "Great question! The `forEach` loop is iterating through each alien in your array. The issue is that you're checking the position before moving the alien...\n\n```js\naliens.forEach((alien) => {\n  alien.move();\n  checkPosition(alien);\n});\n```"
  },
  {
    role: "user",
    content: "Ah I think I understand now. So I need to move first, then check?"
  }
];

// Dev-only mock — ChatInputArea only reads a handful of fields off this.
const mockChat = {
  messages: mockMessages,
  currentResponse: "",
  status: "idle",
  error: null,
  finishTyping: () => {},
  retryLastMessage: () => {},
  clearError: () => {},
  canRetry: false,
  sendMessage: (message: string) => console.debug("Message sent:", message),
  isDisabled: false
} as unknown as ReturnType<typeof useChat>;

export default function ChatPanelStatesDevPage() {
  const [selectedState, setSelectedState] = useState<StateId>("loading");

  const renderComponent = () => {
    if (selectedState === "loading") {
      return <ChatLoading />;
    }
    if (selectedState === "in-progress") {
      return (
        <Conversation
          messages={mockChat.messages}
          currentResponse={mockChat.currentResponse}
          status={mockChat.status}
          onTypingComplete={mockChat.finishTyping}
          footer={<ChatInputArea chat={mockChat} />}
        />
      );
    }
    return (
      <ChatPanelStates
        chatState={selectedState}
        conversation={mockMessages}
        onSendMessage={(message) => console.debug("Message sent:", message)}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4 bg-white border-b border-gray-200">
        <h1 className="text-xl font-bold mb-4">Chat Panel States</h1>
        <div className="flex flex-wrap gap-2">
          {states.map((state) => (
            <button
              key={state.id}
              onClick={() => setSelectedState(state.id)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                selectedState === state.id ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {state.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm flex flex-col" style={{ height: "600px" }}>
          {renderComponent()}
        </div>
      </div>
    </div>
  );
}
