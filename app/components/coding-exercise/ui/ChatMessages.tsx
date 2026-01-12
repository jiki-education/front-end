"use client";

import { useRef } from "react";
import type { ChatMessage, StreamStatus } from "../lib/chat-types";
import TypeItAssistantMessage from "./TypeItAssistantMessage";
import ChatMessageItem from "./ChatMessageItem";
import { useTimelineHeight } from "../lib/useTimelineHeight";
import { useAutoScroll } from "../lib/useAutoScroll";
import { useTypingScroll } from "../lib/useTypingScroll";
import styles from "./chat-panel.module.css";

interface ChatMessagesProps {
  messages: ChatMessage[];
  currentResponse: string;
  status: StreamStatus;
  onTypingComplete?: () => void;
}

export default function ChatMessages({ messages, currentResponse, status, onTypingComplete }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  useTimelineHeight({ chatMessagesRef, scrollWrapperRef }, [messages, currentResponse]);
  useAutoScroll(messagesEndRef, [messages, currentResponse]);
  useTypingScroll(messagesEndRef, status);

  return (
    <div ref={scrollWrapperRef} className={styles.chatScrollWrapper}>
      <div ref={chatMessagesRef} className={styles.chatMessages}>
        {messages.length === 0 && !currentResponse && (
          <div className="text-center text-gray-500 text-sm">
            Start a conversation! Ask questions about your code, the exercise, or request help with specific tasks.
          </div>
        )}

        {messages.map((message, index) => (
          <ChatMessageItem key={`message-${index}`} message={message} />
        ))}

        {(currentResponse || status === "thinking" || status === "typing") && (
          <TypeItAssistantMessage content={currentResponse} status={status} onTypingComplete={onTypingComplete} />
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
