"use client";

import { useRef, type ReactNode } from "react";
import type { ChatMessage, StreamStatus } from "../lib/chat-types";
import TypeItAssistantMessage from "./TypeItAssistantMessage";
import ChatMessageItem from "./ChatMessageItem";
import { useStickToBottom } from "../lib/useStickToBottom";
import styles from "./ChatMessages.module.css";

interface ChatMessagesProps {
  messages: ChatMessage[];
  currentResponse: string;
  status: StreamStatus;
  onTypingComplete?: () => void;
  header?: ReactNode;
}

export default function ChatMessages({
  messages,
  currentResponse,
  status,
  onTypingComplete,
  header
}: ChatMessagesProps) {
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  useStickToBottom(scrollWrapperRef, chatMessagesRef);

  return (
    <div ref={scrollWrapperRef} className={styles.chatScrollWrapper}>
      {header}
      <div ref={chatMessagesRef} className={styles.chatMessages}>
        {messages.length === 0 && !currentResponse && (
          <ChatMessageItem message={{ role: "assistant", content: "What can I help you with?" }} />
        )}

        {messages.map((message, index) => (
          <ChatMessageItem key={`message-${index}`} message={message} />
        ))}

        {(currentResponse || status === "thinking" || status === "typing") && (
          <TypeItAssistantMessage content={currentResponse} status={status} onTypingComplete={onTypingComplete} />
        )}
      </div>
    </div>
  );
}
