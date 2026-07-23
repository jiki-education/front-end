"use client";

import { useEffect, useRef } from "react";
import type { Orchestrator } from "../lib/Orchestrator";
import { useProjectBuilderStore } from "../lib/store";

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
    <div className="relative flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border-primary px-3 py-1.5">
        <span className="text-sm font-medium text-gray-600">Preview</span>
        <button
          onClick={() => orchestrator.run()}
          className="rounded bg-button-primary-bg px-3 py-1 text-sm font-medium text-button-primary-text"
        >
          ▶ Run
        </button>
      </div>
      <div className="relative flex-1 bg-white">
        {srcdoc !== null && (
          <iframe
            key={runCounter}
            ref={iframeRef}
            srcDoc={srcdoc}
            sandbox="allow-scripts"
            title="Project preview"
            className="h-full w-full border-0"
          />
        )}
        {previewError && (
          <div className="absolute inset-x-2 bottom-2 rounded-lg border border-error-border bg-error-bg p-3 text-sm text-error-text shadow">
            <div className="font-medium">
              Something went wrong{previewError.filename ? ` in ${previewError.filename}` : ""}
            </div>
            <div className="mt-1 font-mono text-xs">
              {previewError.message}
              {previewError.line !== undefined && ` (line ${previewError.line})`}
            </div>
            <div className="mt-1 text-xs">Ask Jiki about it in the chat.</div>
          </div>
        )}
      </div>
    </div>
  );
}
