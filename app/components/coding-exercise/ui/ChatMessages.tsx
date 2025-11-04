"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage, StreamStatus } from "../lib/chat-types";
import TypeItAssistantMessage from "./TypeItAssistantMessage";

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
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
  );
}

function ChatMessageItem({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className="flex gap-3">
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? "bg-gray-100" : "bg-blue-100"
        }`}
      >
        <span className={`text-sm font-semibold ${isUser ? "text-gray-600" : "text-blue-600"}`}>
          {isUser ? "U" : "AI"}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 mb-1">{isUser ? "You" : "Assistant"}</div>
        <div className="text-sm text-gray-700 whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  );
}
