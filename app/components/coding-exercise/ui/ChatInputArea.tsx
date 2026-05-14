import type { useChat } from "../lib/useChat";
import ChatInput from "./ChatInput";
import ChatStatus from "./ChatStatus";

interface ChatInputAreaProps {
  chat: ReturnType<typeof useChat>;
}

// The footer for an active conversation: error/status bar plus the message input.
export function ChatInputArea({ chat }: ChatInputAreaProps) {
  return (
    <>
      <ChatStatus error={chat.error} onRetry={chat.retryLastMessage} canRetry={chat.canRetry} />
      <ChatInput
        onSendMessage={chat.sendMessage}
        disabled={chat.isDisabled}
        placeholder={chat.messages.length > 0 ? "Respond to Jiki..." : undefined}
      />
    </>
  );
}
