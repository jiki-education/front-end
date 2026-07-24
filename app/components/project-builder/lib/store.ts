// Instance-based zustand store for a project-builder session, following the
// coding-exercise orchestrator pattern: one store per orchestrator instance,
// read via hook + useShallow, written via orchestrator methods.

import { useStore } from "zustand";
import { useShallow } from "zustand/shallow";
import { createStore, type StoreApi } from "zustand/vanilla";
import type { ConsoleLine, PreviewError, ProjectFiles, TranscriptItem } from "./types";

export interface ProjectBuilderState {
  files: ProjectFiles;
  activeFile: string;
  transcript: TranscriptItem[];
  agentStatus: "idle" | "running";
  srcdoc: string | null;
  runCounter: number;
  previewError: PreviewError | null;
  consoleLines: ConsoleLine[];
  // filename -> timestamp of last agent edit, drives the flash highlight
  agentEditedAt: Record<string, number>;
}

export function createProjectBuilderStore(files: ProjectFiles, activeFile: string): StoreApi<ProjectBuilderState> {
  return createStore<ProjectBuilderState>(() => ({
    files,
    activeFile,
    transcript: [],
    agentStatus: "idle",
    srcdoc: null,
    runCounter: 0,
    previewError: null,
    consoleLines: [],
    agentEditedAt: {}
  }));
}

export function useProjectBuilderStore<T>(
  store: StoreApi<ProjectBuilderState>,
  selector: (state: ProjectBuilderState) => T
): T {
  return useStore(store, useShallow(selector));
}
