"use client";

// The conversation: one continuous transcript (no bubbles), quiet tool-activity
// lines, and a bare input that submits on Enter.

import { useEffect, useRef, useState } from "react";
import type { Orchestrator } from "../lib/Orchestrator";
import { useProjectBuilderStore } from "../lib/store";
import type { TranscriptItem } from "../lib/types";

export function ChatPane({ orchestrator }: { orchestrator: Orchestrator }) {
  const { transcript, agentStatus } = useProjectBuilderStore(orchestrator.getStore(), (state) => ({
    transcript: state.transcript,
    agentStatus: state.agentStatus
  }));
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [transcript]);

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3 text-[15px] leading-relaxed">
        {transcript.length === 0 && (
          <p className="text-gray-500">Tell Jiki what you want to build - it can edit your files and run your code.</p>
        )}
        {transcript.map((item) => (
          <TranscriptEntry key={item.id} item={item} />
        ))}
        {agentStatus === "running" && (
          <span className="inline-block h-4 w-2 animate-pulse bg-gray-400" aria-label="Jiki is working" />
        )}
      </div>
      <ChatInput orchestrator={orchestrator} disabled={agentStatus === "running"} />
    </div>
  );
}

function TranscriptEntry({ item }: { item: TranscriptItem }) {
  switch (item.kind) {
    case "user":
      return <p className="whitespace-pre-wrap text-gray-500">&gt; {item.content}</p>;
    case "assistant":
      return <p className="whitespace-pre-wrap">{item.content}</p>;
    case "tool":
      return <ToolLine item={item} />;
    case "notice":
      return <p className="text-sm italic text-amber-700">{item.content}</p>;
  }
}

function ToolLine({ item }: { item: Extract<TranscriptItem, { kind: "tool" }> }) {
  const glyph = item.status === "running" ? "…" : item.status === "error" ? "⚠" : glyphFor(item.name);
  return (
    <p className={`text-sm ${item.status === "error" ? "text-error-text" : "text-gray-500"}`}>
      {glyph} {item.label}
      {item.detail && <span className="text-gray-400"> · {item.detail}</span>}
    </p>
  );
}

function ChatInput({ orchestrator, disabled }: { orchestrator: Orchestrator; disabled: boolean }) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    const text = value.trim();
    if (!text || disabled) {
      return;
    }
    setValue("");
    void orchestrator.sendMessage(text);
  };

  return (
    <textarea
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSubmit();
        }
      }}
      placeholder={disabled ? "Jiki is working…" : "Message Jiki…"}
      rows={2}
      className="w-full resize-none border-t border-border-primary bg-transparent px-4 py-3 text-[15px] outline-none placeholder:text-gray-400"
    />
  );
}

function glyphFor(toolName: string): string {
  const glyphs: Record<string, string> = {
    write_file: "✏️",
    edit_file: "✏️",
    delete_file: "🗑",
    read_file: "📄",
    list_files: "📄",
    glob: "🔍",
    grep: "🔍",
    run_code: "▶"
  };
  return glyphs[toolName] ?? "·";
}
