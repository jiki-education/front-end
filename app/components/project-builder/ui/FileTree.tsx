"use client";

import { useState } from "react";
import ChevronRightIcon from "@/icons/chevron-right.svg";
import CrossIcon from "@/icons/cross.svg";
import PlusIcon from "@/icons/plus.svg";
import type { Orchestrator } from "../lib/Orchestrator";
import { useProjectBuilderStore } from "../lib/store";
import styles from "./FileTree.module.css";
import { PaneHeader } from "./PaneHeader";

const FLASH_WINDOW_MS = 3000;

export function FileTree({
  orchestrator,
  collapsed,
  onToggleCollapsed
}: {
  orchestrator: Orchestrator;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}) {
  const { files, activeFile, agentEditedAt } = useProjectBuilderStore(orchestrator.getStore(), (state) => ({
    files: state.files,
    activeFile: state.activeFile,
    agentEditedAt: state.agentEditedAt
  }));
  const [isAdding, setIsAdding] = useState(false);
  const [newFilename, setNewFilename] = useState("");

  const handleCreate = () => {
    const filename = newFilename.trim();
    if (filename) {
      orchestrator.createFile(filename);
    }
    setIsAdding(false);
    setNewFilename("");
  };

  return (
    <div className={`${styles.tree} ${collapsed ? styles.collapsed : ""}`}>
      <PaneHeader title={<span className={styles.headerTitle}>Files</span>}>
        {!collapsed && (
          <button
            className={styles.iconButton}
            onClick={() => setIsAdding(true)}
            aria-label="New file"
            title="New file"
          >
            <PlusIcon />
          </button>
        )}
        <button
          className={`${styles.iconButton} ${styles.collapseButton}`}
          onClick={onToggleCollapsed}
          aria-label={collapsed ? "Expand files" : "Collapse files"}
          title={collapsed ? "Expand files" : "Collapse files"}
        >
          <ChevronRightIcon />
        </button>
      </PaneHeader>

      <div className={styles.list}>
        {Object.keys(files)
          .sort()
          .map((filename) => (
            <FileRow
              key={filename}
              filename={filename}
              isActive={filename === activeFile}
              wasJustEdited={Date.now() - (agentEditedAt[filename] ?? 0) < FLASH_WINDOW_MS}
              collapsed={collapsed}
              onSelect={() => orchestrator.setActiveFile(filename)}
              onDelete={filename === "index.html" ? undefined : () => orchestrator.deleteFileFromUi(filename)}
            />
          ))}
        {isAdding && !collapsed && (
          <input
            autoFocus
            className={styles.newFileInput}
            value={newFilename}
            onChange={(e) => setNewFilename(e.target.value)}
            onBlur={handleCreate}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreate();
              }
              if (e.key === "Escape") {
                setIsAdding(false);
                setNewFilename("");
              }
            }}
            placeholder="filename.js"
          />
        )}
      </div>
    </div>
  );
}

function FileRow({
  filename,
  isActive,
  wasJustEdited,
  collapsed,
  onSelect,
  onDelete
}: {
  filename: string;
  isActive: boolean;
  wasJustEdited: boolean;
  collapsed: boolean;
  onSelect: () => void;
  onDelete?: () => void;
}) {
  return (
    <div
      className={`${styles.row} ${isActive ? styles.rowActive : ""} ${wasJustEdited ? styles.rowFlash : ""}`}
      title={collapsed ? filename : undefined}
    >
      <button className={styles.rowSelect} onClick={onSelect}>
        <span className={`${styles.dot} ${styles[dotKind(filename)]}`} aria-hidden />
        <span className={styles.name}>{filename}</span>
      </button>
      {onDelete && !collapsed && (
        <button className={styles.delete} onClick={onDelete} aria-label={`Delete ${filename}`}>
          <CrossIcon />
        </button>
      )}
    </div>
  );
}

// A quiet colour cue by file type so the list is scannable at a glance.
function dotKind(filename: string): "dotHtml" | "dotCss" | "dotJs" | "dotOther" {
  if (filename.endsWith(".html")) {
    return "dotHtml";
  }
  if (filename.endsWith(".css")) {
    return "dotCss";
  }
  if (filename.endsWith(".js")) {
    return "dotJs";
  }
  return "dotOther";
}
