import type { ChatMessage } from "../../lib/chat-types";
import LockedConversation from "./LockedConversation";

interface PremiumUserBlockedProps {
  messages?: ChatMessage[];
}

// Premium user, conversation not allowed
// Temporary block due to fair use limits
export default function PremiumUserBlocked({ messages = [] }: PremiumUserBlockedProps) {
  return <LockedConversation messages={messages} variant="premium-blocked" />;
}
