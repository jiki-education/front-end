"use client";

import { useState } from "react";
import TypeItAssistantMessage from "@/components/coding-exercise/ui/TypeItAssistantMessage";
import type { StreamStatus } from "@/components/coding-exercise/lib/chat-types";

const TEST_MESSAGES = {
  simple: "Hello! This is **bold** and *italic* and `code`.",
  codeBlock: `Here's the solution:

\`\`\`javascript
if (canMoveForward()) {
  moveForward();
}
\`\`\`

That's it!`,
  mixed: `## Solution

Use **bold** for emphasis, *italics* for subtle emphasis, and \`inline code\`.

\`\`\`python
while not atGoal():
    moveForward()
\`\`\`

- List item 1
- List item 2`
};

export default function ChatMarkdownTest() {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<StreamStatus>("idle");
  const [selected, setSelected] = useState<keyof typeof TEST_MESSAGES>("simple");

  const startTyping = () => {
    setContent(TEST_MESSAGES[selected]);
    setStatus("typing");
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chat Markdown Test</h1>

      <div className="space-y-4 mb-6">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value as keyof typeof TEST_MESSAGES)}
          className="border p-2 rounded"
        >
          <option value="simple">Simple markdown</option>
          <option value="codeBlock">Code block</option>
          <option value="mixed">Mixed content</option>
        </select>

        <button onClick={startTyping} className="bg-blue-500 text-white px-4 py-2 rounded">
          Start Typing
        </button>

        <button
          onClick={() => {
            setContent("");
            setStatus("idle");
          }}
          className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
        >
          Reset
        </button>
      </div>

      <div className="border rounded p-4 min-h-[200px]">
        {content ? (
          <TypeItAssistantMessage
            content={content}
            status={status}
            typingSpeed={1000}
            onTypingComplete={() => setStatus("idle")}
          />
        ) : (
          <p className="text-gray-400">Select a message and click Start Typing</p>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Status: {status} | Content length: {content.length}
      </div>
    </div>
  );
}
