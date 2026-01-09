"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage, StreamStatus } from "../lib/chat-types";
import TypeItAssistantMessage from "./TypeItAssistantMessage";
import { processMessageContent } from "./messageUtils";
import styles from "./chat-panel.module.css";


interface ChatMessagesProps {
  messages: ChatMessage[];
  currentResponse: string;
  status: StreamStatus;
  onTypingComplete?: () => void;
}

export default function ChatMessages({ messages, currentResponse, status, onTypingComplete }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive or response updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentResponse]);

  // Continuous scrolling during typing animation
  useEffect(() => {
    if (status === "typing") {
      const intervalId = setInterval(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100); // Scroll every 100ms during typing

      return () => clearInterval(intervalId);
    }
  }, [status]);

  return (
    <div className={styles.chatScrollWrapper}>
      <div className={styles.chatMessages}>
        {messages.length === 0 && !currentResponse && (
          <div className="text-center text-gray-500 text-sm">
            Start a conversation! Ask questions about your code, the exercise, or request help with specific tasks.
          </div>
        )}

        {messages.map((message, index) => (
          <ChatMessageItem key={index} message={message} />
        ))}

        {(currentResponse || status === "thinking" || status === "typing") && (
          <TypeItAssistantMessage content={currentResponse} status={status} onTypingComplete={onTypingComplete} />
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

function ChatMessageItem({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  // Parse markdown content and process for special formatting
  const htmlContent = processMessageContent(message.content);

  if (isUser) {
    return (
      <div className={styles.prompt}>
        <div className={styles.avatar}>N</div>
        <div className={styles.promptContent} dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    );
  } else {
    return (
      <div className={styles.response}>
        <div className={styles.avatar}>J</div>
        <div className={styles.responseContent} dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    );
  }
}

