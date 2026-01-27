import type { ChatMessage } from "../../lib/chat-types";
import LockedConversation from "./LockedConversation";

interface FreeUserLimitReachedWithHistoryProps {
  messages?: ChatMessage[];
}

// Non-premium user, conversation not allowed, but has existing conversation
// They can view their past conversation but can't continue
export default function FreeUserLimitReachedWithHistory({ messages = [] }: FreeUserLimitReachedWithHistoryProps) {
  return <LockedConversation messages={messages} variant="free-limit-reached" />;
}
