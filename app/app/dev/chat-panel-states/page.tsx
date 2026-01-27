"use client";

import { useState } from "react";
import {
  FreeUserCanStart,
  FreeUserLimitReached,
  FreeUserLimitReachedWithHistory,
  PremiumUserBlocked,
  PremiumUserCanStart
} from "@/components/coding-exercise/ui/chat-panel-states";
import type { ChatMessage } from "@/components/coding-exercise/lib/chat-types";

type StateId =
  | "free-user-can-start"
  | "free-user-limit-reached"
  | "free-user-limit-reached-with-history"
  | "premium-user-blocked"
  | "premium-user-can-start";

const states: { id: StateId; label: string }[] = [
  { id: "free-user-can-start", label: "Free User Can Start" },
  { id: "free-user-limit-reached", label: "Free User Limit Reached" },
  { id: "free-user-limit-reached-with-history", label: "Free User Limit Reached (With History)" },
  { id: "premium-user-blocked", label: "Premium User Blocked" },
  { id: "premium-user-can-start", label: "Premium User Can Start" }
];

const mockMessages: ChatMessage[] = [
  {
    role: "assistant",
    content:
      "Great question! The `forEach` loop is iterating through each alien in your array. The issue is that you're checking the position before moving the alien..."
  },
  {
    role: "user",
    content: "Ah I think I understand now. So I need to move first, then check?"
  }
];

export default function ChatPanelStatesDevPage() {
  const [selectedState, setSelectedState] = useState<StateId>("free-user-can-start");

  const handleStartChat = () => {
    console.debug("Start chat clicked");
  };

  const renderComponent = () => {
    switch (selectedState) {
      case "free-user-can-start":
        return <FreeUserCanStart onStartChat={handleStartChat} />;
      case "free-user-limit-reached":
        return <FreeUserLimitReached />;
      case "free-user-limit-reached-with-history":
        return <FreeUserLimitReachedWithHistory messages={mockMessages} />;
      case "premium-user-blocked":
        return <PremiumUserBlocked />;
      case "premium-user-can-start":
        return <PremiumUserCanStart />;
    }
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
        <div className="bg-white rounded-lg shadow-sm" style={{ height: "600px" }}>
          {renderComponent()}
        </div>
      </div>
    </div>
  );
}
