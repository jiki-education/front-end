"use client";

// One CodeMirror EditorView with a per-file EditorState cache so switching
// files preserves undo history. Agent edits to the active file are applied as
// a single replace-all transaction.

import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { EditorState, type Extension } from "@codemirror/state";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { useEffect, useRef } from "react";
import type { Orchestrator } from "../lib/Orchestrator";
import { useProjectBuilderStore } from "../lib/store";

export function CodeEditor({ orchestrator }: { orchestrator: Orchestrator }) {
  const { activeFile, files } = useProjectBuilderStore(orchestrator.getStore(), (state) => ({
    activeFile: state.activeFile,
    files: state.files
  }));
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const stateCacheRef = useRef<Map<string, EditorState>>(new Map());
  const displayedFileRef = useRef<string | null>(null);
  // Set while we apply an external (agent) change so the update listener
  // doesn't echo it back into the store.
  const applyingExternalRef = useRef(false);

  // Create/destroy the view with the DOM element (StrictMode-safe).
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const view = new EditorView({ parent: container });
    const stateCache = stateCacheRef.current;
    viewRef.current = view;
    displayedFileRef.current = null;
    return () => {
      view.destroy();
      viewRef.current = null;
      stateCache.clear();
      displayedFileRef.current = null;
    };
  }, []);

  // Swap in the active file's state; sync external content changes.
  useEffect(() => {
    const view = viewRef.current;
    if (!view) {
      return;
    }
    const content = files[activeFile] ?? "";

    if (displayedFileRef.current !== activeFile) {
      if (displayedFileRef.current !== null) {
        stateCacheRef.current.set(displayedFileRef.current, view.state);
      }
      const cached = stateCacheRef.current.get(activeFile);
      const state =
        cached && cached.doc.toString() === content
          ? cached
          : EditorState.create({ doc: content, extensions: extensionsFor(activeFile, orchestrator) });
      view.setState(state);
      displayedFileRef.current = activeFile;
      return;
    }

    const currentDoc = view.state.doc.toString();
    if (currentDoc !== content) {
      applyingExternalRef.current = true;
      view.dispatch({ changes: { from: 0, to: currentDoc.length, insert: content } });
      applyingExternalRef.current = false;
    }
  }, [activeFile, files, orchestrator]);

  function extensionsFor(filename: string, orch: Orchestrator): Extension[] {
    return [
      lineNumbers(),
      history(),
      keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
      languageFor(filename),
      EditorView.theme({ "&": { height: "100%", fontSize: "14px" } }),
      EditorView.updateListener.of((update) => {
        if (update.docChanged && !applyingExternalRef.current) {
          orch.updateFileFromEditor(filename, update.state.doc.toString());
        }
      })
    ];
  }

  return (
    <div ref={containerRef} className="h-full overflow-hidden [&_.cm-editor]:h-full [&_.cm-scroller]:overflow-auto" />
  );
}

function languageFor(filename: string): Extension {
  if (filename.endsWith(".html")) {
    return html();
  }
  if (filename.endsWith(".css")) {
    return css();
  }
  return javascript();
}
