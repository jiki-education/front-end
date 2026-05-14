import type { ChatMessage } from "../../lib/chat-types";
import { Conversation } from "../Conversation";
import { LockedFooter } from "./LockedFooter";

interface PremiumUserBlockedProps {
  messages?: ChatMessage[];
}

// Premium user, conversation not allowed
// Temporary block due to fair use limits
export default function PremiumUserBlocked({ messages = [] }: PremiumUserBlockedProps) {
  return <Conversation messages={messages} footer={<LockedFooter variant="premium-blocked" />} />;
}
