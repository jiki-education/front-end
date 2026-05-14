import type { ChatMessage } from "../../lib/chat-types";
import { Conversation } from "../Conversation";
import { LockedFooter } from "./LockedFooter";

interface FreeUserLimitReachedWithHistoryProps {
  messages?: ChatMessage[];
}

// Non-premium user, conversation not allowed, but has existing conversation
// They can view their past conversation but can't continue
export default function FreeUserLimitReachedWithHistory({ messages = [] }: FreeUserLimitReachedWithHistoryProps) {
  return <Conversation messages={messages} footer={<LockedFooter variant="free-limit-reached" />} />;
}
