import TypeIt from "typeit-react";
import { marked } from "marked";
import type { StreamStatus } from "../lib/chat-types";

interface TypeItAssistantMessageProps {
  content: string;
  status: StreamStatus;
  typingSpeed?: number;
  onTypingComplete?: () => void;
}

export default function TypeItAssistantMessage({
  content,
  status,
  typingSpeed = 50,
  onTypingComplete
}: TypeItAssistantMessageProps) {
  // Show thinking state
  if (status === "thinking") {
    return (
      <div className="flex gap-3">
        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 text-sm font-semibold">AI</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 mb-1">Assistant (thinking...)</div>
          <div className="text-sm text-gray-700 whitespace-pre-wrap">
            AI is thinking...
            <span className="animate-pulse">▊</span>
          </div>
        </div>
      </div>
    );
  }

  // Show typing or completed message
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
        <span className="text-blue-600 text-sm font-semibold">AI</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 mb-1">Assistant</div>
        <div className="text-sm text-gray-700 prose prose-sm max-w-none prose-code:before:content-[''] prose-code:after:content-[''] prose-code:bg-blue-100 prose-code:px-2 prose-code:py-1 prose-code:rounded">
          {status === "typing" && content ? (
            <TypeIt
              options={{
                speed: typingSpeed,
                afterComplete: () => {
                  onTypingComplete?.();
                }
              }}
            >
              {content}
            </TypeIt>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: marked.parse(content) }} />
          )}
        </div>
      </div>
    </div>
  );
}
