"use client";

// The conversation with Jiki: a welcoming empty state, user messages as
// bubbles, assistant prose, quiet activity chips for tool calls, and an
// auto-growing composer (Enter sends, Shift+Enter for a newline). Ported from
// the coding-exercise ChatInput behaviour.

import { useEffect, useRef, useState } from "react";
import { useStore } from "zustand";
import SendArrow from "@/icons/send-arrow.svg";
import { devSettingsStore } from "../lib/debug/devSettingsStore";
import type { Orchestrator } from "../lib/Orchestrator";
import { useProjectBuilderStore } from "../lib/store";
import type { TranscriptItem } from "../lib/types";
import styles from "./ChatPane.module.css";
import { PaneHeader } from "./PaneHeader";

const SUGGESTIONS = ["Change the headline", "Pick some colours", "Add an about-me"];

export function ChatPane({ orchestrator }: { orchestrator: Orchestrator }) {
  const { transcript, agentStatus } = useProjectBuilderStore(orchestrator.getStore(), (state) => ({
    transcript: state.transcript,
    agentStatus: state.agentStatus
  }));
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isRunning = agentStatus === "running";
  const hasKey = useStore(devSettingsStore, (state) => state.llmKey.trim().length > 0);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [transcript]);

  const send = (text: string) => {
    void orchestrator.sendMessage(text);
  };

  return (
    <div className={styles.chat}>
      <PaneHeader
        title={
          <span className={styles.headerTitle}>
            <span className={styles.avatar}>J</span> Jiki
          </span>
        }
      />
      <div ref={scrollRef} className={styles.scroll}>
        {transcript.length === 0 ? (
          <EmptyState hasKey={hasKey} disabled={isRunning} onPick={send} />
        ) : (
          <>
            {transcript.map((item) => (
              <TranscriptEntry key={item.id} item={item} />
            ))}
            {isRunning && <span className={styles.working} aria-label="Jiki is working" />}
          </>
        )}
      </div>
      <ChatComposer disabled={isRunning} onSend={send} />
    </div>
  );
}

function EmptyState({
  hasKey,
  disabled,
  onPick
}: {
  hasKey: boolean;
  disabled: boolean;
  onPick: (text: string) => void;
}) {
  if (!hasKey) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyAvatar}>J</div>
        <h3 className={styles.emptyTitle}>Add a key to get started</h3>
        <p className={styles.emptyText}>
          Jiki needs a model to talk to. Open the <strong>debug</strong> panel at the bottom of the screen and paste an
          API key under Controls, then message me here.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.empty}>
      <div className={styles.emptyAvatar}>J</div>
      <h3 className={styles.emptyTitle}>Let&apos;s build your homepage</h3>
      <p className={styles.emptyText}>
        Tell me what you&apos;d like to make. I can edit your files and run the code for you.
      </p>
      <div className={styles.chips}>
        {SUGGESTIONS.map((text) => (
          <button key={text} className={styles.chip} disabled={disabled} onClick={() => onPick(text)}>
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

function TranscriptEntry({ item }: { item: TranscriptItem }) {
  switch (item.kind) {
    case "user":
      return <div className={styles.userMessage}>{item.content}</div>;
    case "assistant":
      return <p className={styles.assistantMessage}>{item.content}</p>;
    case "tool":
      return <ToolLine item={item} />;
    case "notice":
      return <p className={styles.notice}>{item.content}</p>;
  }
}

function ToolLine({ item }: { item: Extract<TranscriptItem, { kind: "tool" }> }) {
  const isError = item.status === "error";
  const isRun = item.name === "run_code";
  const glyph = item.status === "running" ? "…" : isError ? "⚠" : glyphFor(item.name);
  return (
    <div className={`${styles.activity} ${isError ? styles.activityError : ""} ${isRun ? styles.activityRun : ""}`}>
      <span className={styles.activityGlyph}>{glyph}</span>
      <span>{item.label}</span>
      {item.detail && <span className={styles.activityDetail}> · {item.detail}</span>}
    </div>
  );
}

function ChatComposer({ disabled, onSend }: { disabled: boolean; onSend: (text: string) => void }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-grow: reset to content height each keystroke, capped by max-height.
  const resize = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  const handleSend = () => {
    const text = value.trim();
    if (!text || disabled) {
      return;
    }
    onSend(text);
    setValue("");
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
    }
  };

  return (
    <div className={styles.composer}>
      <div className={styles.composerField}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            resize();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={disabled ? "Jiki is working…" : "Message Jiki…"}
          rows={1}
        />
        <button
          className={styles.sendButton}
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          aria-label="Send"
        >
          <SendArrow />
        </button>
      </div>
    </div>
  );
}

function glyphFor(toolName: string): string {
  const glyphs: Record<string, string> = {
    write_file: "✎",
    edit_file: "✎",
    delete_file: "🗑",
    read_file: "📄",
    list_files: "📄",
    glob: "🔍",
    grep: "🔍",
    run_code: "▶"
  };
  return glyphs[toolName] ?? "·";
}
