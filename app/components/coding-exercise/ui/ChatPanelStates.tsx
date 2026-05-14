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
export function ChatPanelStates({ chatState, conversation, onSendMessage, onStartChat }: ChatPanelStatesProps) {
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
