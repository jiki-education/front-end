"use client";

import { useState } from "react";
import type { Orchestrator } from "../lib/Orchestrator";
import { useProjectBuilderStore } from "../lib/store";

const FLASH_WINDOW_MS = 3000;

export function FileTree({ orchestrator }: { orchestrator: Orchestrator }) {
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
    <div className="flex h-full flex-col gap-1 overflow-y-auto p-2">
      {Object.keys(files)
        .sort()
        .map((filename) => (
          <FileRow
            key={filename}
            filename={filename}
            isActive={filename === activeFile}
            wasJustEdited={Date.now() - (agentEditedAt[filename] ?? 0) < FLASH_WINDOW_MS}
            onSelect={() => orchestrator.setActiveFile(filename)}
            onDelete={filename === "index.html" ? undefined : () => orchestrator.deleteFileFromUi(filename)}
          />
        ))}
      {isAdding ? (
        <input
          autoFocus
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
          className="rounded border border-border-primary px-2 py-1 font-mono text-sm"
        />
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="mt-1 rounded px-2 py-1 text-left text-sm text-gray-500 hover:bg-bg-secondary"
        >
          + file
        </button>
      )}
    </div>
  );
}

function FileRow({
  filename,
  isActive,
  wasJustEdited,
  onSelect,
  onDelete
}: {
  filename: string;
  isActive: boolean;
  wasJustEdited: boolean;
  onSelect: () => void;
  onDelete?: () => void;
}) {
  return (
    <div
      className={`group flex items-center justify-between rounded px-2 py-1 font-mono text-sm ${
        isActive ? "bg-blue-100 text-blue-900" : "hover:bg-bg-secondary"
      } ${wasJustEdited ? "animate-pulse" : ""}`}
    >
      <button onClick={onSelect} className="flex-1 truncate text-left">
        {filename}
      </button>
      {onDelete && (
        <button
          onClick={onDelete}
          className="hidden text-gray-400 hover:text-error-500 group-hover:inline"
          aria-label={`Delete ${filename}`}
        >
          ×
        </button>
      )}
    </div>
  );
}
