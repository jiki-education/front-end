"use client";

import type { StreamStatus } from "../lib/chat-types";

interface ChatStatusProps {
  status: StreamStatus;
  error: string | null;
}

export default function ChatStatus({ status, error }: ChatStatusProps) {
  if (error) {
    return (
      <div className="px-4 py-2 bg-red-50 border-t border-red-200">
        <div className="flex items-center gap-2 text-red-700">
          <span className="text-red-500">⚠️</span>
          <span className="text-sm font-medium">Error:</span>
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  if (status === "streaming") {
    return (
      <div className="px-4 py-2 bg-blue-50 border-t border-blue-200">
        <div className="flex items-center gap-2 text-blue-700">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
          <span className="text-sm font-medium">Assistant is typing...</span>
        </div>
      </div>
    );
  }

  // For idle status, we don't show anything to keep the UI clean
  return null;
}
