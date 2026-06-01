"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import type { ChatMessage } from "../lib/chat-types";
import {
  FreeUserCanStart,
  FreeUserLimitReached,
  FreeUserLimitReachedWithHistory,
  PremiumUserBlocked,
  PremiumUserCanStart
} from "./chat-panel-states";

export type ChatPanelState =
  | "in-progress"
  | "free-user-can-start"
  | "free-user-limit-reached"
  | "free-user-limit-reached-with-history"
  | "premium-user-blocked"
  | "premium-user-can-start";

interface ChatPanelStatesProps {
  chatState: ChatPanelState;
  conversation: ChatMessage[];
  onSendMessage: (message: string) => void;
  onStartChat: () => void;
}

// Each state component renders its own heading/intro, so no shared ChatHeader here
// (that belongs to the in-progress conversation view).
const BLOCKED_FREE_STATES = new Set<ChatPanelState>([
  "free-user-can-start",
  "free-user-limit-reached",
  "free-user-limit-reached-with-history"
]);

export function ChatPanelStates({ chatState, conversation, onSendMessage, onStartChat }: ChatPanelStatesProps) {
  // Fire `premium_feature_blocked` when a free user lands on the assistant
  // tab in any blocked state. Re-fires if they transition between blocked
  // states (e.g. start chat → exhaust limit) — that's a distinct paywall view.
  useEffect(() => {
    if (BLOCKED_FREE_STATES.has(chatState)) {
      trackEvent("premium_feature_blocked", { feature: "assistant_tab" });
    }
  }, [chatState]);

  switch (chatState) {
    case "free-user-can-start":
      return <FreeUserCanStart onStartChat={onStartChat} />;
    case "free-user-limit-reached":
      return <FreeUserLimitReached />;
    case "free-user-limit-reached-with-history":
      return <FreeUserLimitReachedWithHistory messages={conversation} />;
    case "premium-user-blocked":
      return <PremiumUserBlocked messages={conversation} />;
    case "premium-user-can-start":
      return <PremiumUserCanStart onSendMessage={onSendMessage} />;
    case "in-progress":
      return null;
  }
}
