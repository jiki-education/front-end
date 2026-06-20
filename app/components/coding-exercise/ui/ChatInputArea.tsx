import type { useChat } from "../lib/useChat";
import { deriveUsageStatus } from "../lib/chatUsage";
import ChatInput from "./ChatInput";
import ChatStatus from "./ChatStatus";
import ChatUsageNotice from "./ChatUsageNotice";

interface ChatInputAreaProps {
  chat: ReturnType<typeof useChat>;
}

// The footer for an active conversation: error/status bar, usage notice, and
// the message input.
export function ChatInputArea({ chat }: ChatInputAreaProps) {
  const usageStatus = deriveUsageStatus(chat.usage);
  const atCap = usageStatus?.atCap ?? false;

  return (
    <>
      <ChatStatus error={chat.error} onRetry={chat.retryLastMessage} canRetry={chat.canRetry} />
      <ChatUsageNotice status={usageStatus} />
      <ChatInput
        onSendMessage={chat.sendMessage}
        disabled={chat.isDisabled || atCap}
        placeholder={
          atCap ? "You've reached your message limit" : chat.messages.length > 0 ? "Respond to Jiki..." : undefined
        }
      />
    </>
  );
}
