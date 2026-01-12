import { useState } from "react";
import type { ChatMessage, StreamStatus } from "./chat-types";

// Mock chat data for styling and development
const mockMessages: ChatMessage[] = [
  {
    role: "user",
    content: "How do I check if the robot can move forward?",
    timestamp: new Date(Date.now() - 300000).toISOString() // 5 minutes ago
  },
  {
    role: "assistant",
    content:
      "Great question! Use the `canMoveForward()` function to check if the path ahead is clear.\n\nHere's how you can use it in a conditional:\n\n`if (canMoveForward()) { moveForward(); }`\n\nThis checks if the path is clear before moving, preventing the robot from hitting walls!",
    timestamp: new Date(Date.now() - 240000).toISOString() // 4 minutes ago
  },
  {
    role: "user",
    content:
      "I tried this code but it's not working:\n\n`if canMoveForward() { moveForward() }`\n\nWhat am I doing wrong?",
    timestamp: new Date(Date.now() - 180000).toISOString() // 3 minutes ago
  },
  {
    role: "assistant",
    content:
      "Good attempt! You're missing the parentheses around the condition. In most programming languages, the condition in an `if` statement needs to be wrapped in parentheses.\n\nHere's the corrected version:\n\n`if (canMoveForward()) { moveForward(); }`\n\nNotice the `()` around `canMoveForward()` and the semicolon after `moveForward()`.",
    timestamp: new Date(Date.now() - 120000).toISOString() // 2 minutes ago
  },
  {
    role: "user",
    content: "Can I check multiple conditions?",
    timestamp: new Date(Date.now() - 60000).toISOString() // 1 minute ago
  },
  {
    role: "assistant",
    content:
      "Absolutely! You can use `else if` to check multiple conditions in sequence. Here's a complete example:\n\n```\nif (atGoal()) {\n  celebrate();\n} else if (canMoveForward()) {\n  moveForward();\n} else {\n  turnRight();\n}\n```\n\nThis checks if you're at the goal first, then if you can move forward, and finally turns if neither is true. The program evaluates each condition in order and executes the first block where the condition is true.",
    timestamp: new Date(Date.now() - 30000).toISOString() // 30 seconds ago
  }
];

export function useMockChat() {
  const [messages] = useState<ChatMessage[]>(mockMessages);
  const [currentResponse] = useState<string>("");
  const [status] = useState<StreamStatus>("idle");
  const [error] = useState<string | null>(null);

  return {
    messages,
    currentResponse,
    status,
    error,
    sendMessage: (message: string) => {
      // Mock implementation - no-op
      void message;
    },
    clearConversation: () => {
      // Mock implementation - no-op
    },
    retryLastMessage: () => {
      // Mock implementation - no-op
    },
    clearError: () => {
      // Mock implementation - no-op
    },
    finishTyping: () => {
      // Mock implementation - no-op
    },
    loadConversation: (conversation: ChatMessage[]) => {
      // Mock implementation - no-op
      void conversation;
    },
    isDisabled: false,
    canRetry: false,
    context: {
      exerciseSlug: "mock-exercise"
    }
  };
}
