"use client";

import { useState } from "react";
import TypeItAssistantMessage from "@/components/coding-exercise/ui/TypeItAssistantMessage";
import type { StreamStatus } from "@/components/coding-exercise/lib/chat-types";
import styles from "./page.module.css";

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
    <div className={styles.page}>
      <h1 className={styles.title}>Chat Markdown Test</h1>

      <div className={styles.controls}>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value as keyof typeof TEST_MESSAGES)}
          className={styles.select}
        >
          <option value="simple">Simple markdown</option>
          <option value="codeBlock">Code block</option>
          <option value="mixed">Mixed content</option>
        </select>

        <button onClick={startTyping} className={styles.startButton}>
          Start Typing
        </button>

        <button
          onClick={() => {
            setContent("");
            setStatus("idle");
          }}
          className={styles.resetButton}
        >
          Reset
        </button>
      </div>

      <div className={styles.preview}>
        {content ? (
          <TypeItAssistantMessage
            content={content}
            status={status}
            typingSpeed={1000}
            onTypingComplete={() => setStatus("idle")}
          />
        ) : (
          <p className={styles.placeholder}>Select a message and click Start Typing</p>
        )}
      </div>

      <div className={styles.status}>
        Status: {status} | Content length: {content.length}
      </div>
    </div>
  );
}
