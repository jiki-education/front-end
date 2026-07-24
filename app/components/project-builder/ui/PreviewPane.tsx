"use client";

import { useEffect, useRef } from "react";
import type { Orchestrator } from "../lib/Orchestrator";
import { useProjectBuilderStore } from "../lib/store";
import { PaneHeader } from "./PaneHeader";
import styles from "./PreviewPane.module.css";

export function PreviewPane({ orchestrator }: { orchestrator: Orchestrator }) {
  const { srcdoc, runCounter, previewError } = useProjectBuilderStore(orchestrator.getStore(), (state) => ({
    srcdoc: state.srcdoc,
    runCounter: state.runCounter,
    previewError: state.previewError
  }));
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Register the iframe's window so the orchestrator can attribute postMessages.
  useEffect(() => {
    orchestrator.setIframeWindow(iframeRef.current?.contentWindow ?? null);
    return () => {
      orchestrator.setIframeWindow(null);
    };
  }, [orchestrator, runCounter]);

  // First run on mount.
  useEffect(() => {
    if (orchestrator.getStore().getState().srcdoc === null) {
      orchestrator.run();
    }
  }, [orchestrator]);

  return (
    <div className={styles.preview}>
      <PaneHeader title="Preview">
        <button className={styles.runButton} onClick={() => orchestrator.run()}>
          <span aria-hidden>▶</span> Run
        </button>
      </PaneHeader>
      <div className={styles.canvas}>
        {srcdoc !== null && (
          <iframe
            key={runCounter}
            ref={iframeRef}
            srcDoc={srcdoc}
            sandbox="allow-scripts"
            title="Project preview"
            className={styles.frame}
          />
        )}
        {previewError && (
          <div className={styles.error}>
            <div className={styles.errorTitle}>
              Something went wrong{previewError.filename ? ` in ${previewError.filename}` : ""}
            </div>
            <div className={styles.errorMessage}>
              {previewError.message}
              {previewError.line !== undefined && ` (line ${previewError.line})`}
            </div>
            <div className={styles.errorHint}>Ask Jiki about it in the chat.</div>
          </div>
        )}
      </div>
    </div>
  );
}
