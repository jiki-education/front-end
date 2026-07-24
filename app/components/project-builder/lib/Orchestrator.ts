// Facade coordinating the project-builder session: file state, preview
// lifecycle, console capture, persistence, and the agent turn loop.

import type { StoreApi } from "zustand/vanilla";
import { runAgentTurn } from "./agentLoop";
import { debugLog, registerDebugAction } from "./debug/debugBus";
import { buildPreview, type BuiltPreview } from "./previewBuilder";
import { createProjectBuilderStore, type ProjectBuilderState } from "./store";
import type {
  ChatCompletionMessage,
  ConsoleLine,
  LessonConfig,
  PreviewError,
  ProjectFiles,
  TranscriptItem
} from "./types";

// Omit that distributes over the TranscriptItem union.
type TranscriptItemInput = TranscriptItem extends infer T ? (T extends TranscriptItem ? Omit<T, "id"> : never) : never;

const STORAGE_VERSION = 1;
const SAVE_DEBOUNCE_MS = 500;
const AGENT_RUN_SETTLE_MS = 1000;

interface StoredProject {
  version: number;
  storedAt: string;
  files: ProjectFiles;
}

export class Orchestrator {
  readonly lesson: LessonConfig;
  // Model-facing conversation history (persona/files are rebuilt per call and
  // never stored here).
  readonly history: ChatCompletionMessage[] = [];

  private readonly store: StoreApi<ProjectBuilderState>;
  private builtPreview: BuiltPreview | null = null;
  private iframeWindow: Window | null = null;
  private currentRunLines: ConsoleLine[] = [];
  private currentRunError: PreviewError | null = null;
  private saveTimeout: ReturnType<typeof setTimeout> | null = null;
  private transcriptId = 0;
  private readonly unregisterDebug: (() => void) | null = null;
  private readonly onWindowMessage = (event: MessageEvent) => {
    this.handleWindowMessage(event);
  };

  constructor(lesson: LessonConfig) {
    this.lesson = lesson;
    const files = this.loadPersistedFiles() ?? { ...lesson.startingFiles };
    this.store = createProjectBuilderStore(files, firstFile(files));

    if (typeof window !== "undefined") {
      window.addEventListener("message", this.onWindowMessage);
      this.unregisterDebug = registerDebugAction("Reset project", () => {
        this.resetProject();
      });
    }
  }

  getStore(): StoreApi<ProjectBuilderState> {
    return this.store;
  }

  cleanup(): void {
    if (typeof window !== "undefined") {
      window.removeEventListener("message", this.onWindowMessage);
    }
    this.unregisterDebug?.();
  }

  // File state (used by the editor, file tree and agent tools)

  getFiles(): ProjectFiles {
    return this.store.getState().files;
  }

  setActiveFile(filename: string): void {
    this.store.setState({ activeFile: filename });
  }

  updateFileFromEditor(filename: string, content: string): void {
    this.store.setState((state) => ({ files: { ...state.files, [filename]: content } }));
    this.scheduleSave();
  }

  createFile(filename: string): void {
    if (filename in this.getFiles()) {
      return;
    }
    this.store.setState((state) => ({ files: { ...state.files, [filename]: "" }, activeFile: filename }));
    this.scheduleSave();
  }

  deleteFileFromUi(filename: string): void {
    if (filename === "index.html") {
      return;
    }
    this.removeFile(filename);
  }

  agentSetFile(filename: string, content: string): void {
    this.store.setState((state) => ({
      files: { ...state.files, [filename]: content },
      agentEditedAt: { ...state.agentEditedAt, [filename]: Date.now() }
    }));
    this.scheduleSave();
  }

  agentDeleteFile(filename: string): void {
    this.removeFile(filename);
  }

  resetProject(): void {
    debugLog("state", "reset project");
    this.history.length = 0;
    this.store.setState({
      files: { ...this.lesson.startingFiles },
      activeFile: firstFile(this.lesson.startingFiles),
      transcript: [],
      previewError: null,
      consoleLines: [],
      agentEditedAt: {},
      srcdoc: null
    });
    this.scheduleSave();
  }

  // Preview

  setIframeWindow(iframeWindow: Window | null): void {
    this.iframeWindow = iframeWindow;
  }

  run(): void {
    this.currentRunLines = [];
    this.currentRunError = null;
    this.builtPreview = buildPreview(this.getFiles(), this.lesson.allowedLibraries);
    this.store.setState((state) => ({
      srcdoc: this.builtPreview?.srcdoc ?? null,
      runCounter: state.runCounter + 1,
      previewError: null,
      consoleLines: []
    }));
    debugLog("preview", "run", { files: Object.keys(this.getFiles()) });
  }

  async runForAgent(): Promise<{ consoleLines: ConsoleLine[]; error: PreviewError | null }> {
    this.run();
    await sleep(AGENT_RUN_SETTLE_MS);
    return { consoleLines: [...this.currentRunLines], error: this.currentRunError };
  }

  // Agent

  async sendMessage(text: string): Promise<void> {
    if (this.store.getState().agentStatus === "running") {
      return;
    }
    await runAgentTurn(this, text);
  }

  setAgentStatus(status: "idle" | "running"): void {
    this.store.setState({ agentStatus: status });
  }

  // Transcript

  appendTranscript(item: TranscriptItemInput): string {
    const id = `t${++this.transcriptId}`;
    this.store.setState((state) => ({ transcript: [...state.transcript, { ...item, id }] }));
    return id;
  }

  updateTranscript(id: string, update: Partial<TranscriptItem>): void {
    this.store.setState((state) => ({
      transcript: state.transcript.map((item) => (item.id === id ? ({ ...item, ...update } as TranscriptItem) : item))
    }));
  }

  // Internals

  private removeFile(filename: string): void {
    this.store.setState((state) => {
      const files = { ...state.files };
      delete files[filename];
      const activeFile = state.activeFile === filename ? firstFile(files) : state.activeFile;
      return { files, activeFile };
    });
    this.scheduleSave();
  }

  private handleWindowMessage(event: MessageEvent): void {
    if (this.iframeWindow === null || event.source !== this.iframeWindow) {
      return;
    }
    const data = (event.data as { __jikiProjectBuilder?: Record<string, unknown> } | null)?.__jikiProjectBuilder;
    if (!data) {
      return;
    }

    if (data.kind === "console") {
      const line: ConsoleLine = {
        level: data.level as ConsoleLine["level"],
        text: String(data.text ?? "")
      };
      this.currentRunLines.push(line);
      this.store.setState((state) => ({ consoleLines: [...state.consoleLines, line] }));
      debugLog("console", `[${line.level}] ${line.text}`);
      return;
    }

    if (data.kind === "error") {
      const error: PreviewError = {
        message: String(data.message ?? "Unknown error"),
        filename: this.filenameForSource(String(data.source ?? "")),
        line: typeof data.line === "number" ? data.line : undefined
      };
      this.currentRunError = error;
      this.store.setState({ previewError: error });
      debugLog("console", `error: ${error.message}`, error);
    }
  }

  private filenameForSource(source: string): string | undefined {
    return this.builtPreview?.urlToFile[source];
  }

  private scheduleSave(): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => {
      this.persistFiles();
    }, SAVE_DEBOUNCE_MS);
  }

  private persistFiles(): void {
    try {
      const stored: StoredProject = {
        version: STORAGE_VERSION,
        storedAt: new Date().toISOString(),
        files: this.getFiles()
      };
      window.localStorage.setItem(this.storageKey(), JSON.stringify(stored));
    } catch {
      // quota exceeded or unavailable - saving is best-effort in the prototype
    }
  }

  private loadPersistedFiles(): ProjectFiles | null {
    if (typeof window === "undefined") {
      return null;
    }
    try {
      const raw = window.localStorage.getItem(this.storageKey());
      if (!raw) {
        return null;
      }
      // Parse as unknown shape - localStorage contents are untrusted.
      const parsed = JSON.parse(raw) as { version?: unknown; files?: unknown };
      if (parsed.version !== STORAGE_VERSION || typeof parsed.files !== "object" || parsed.files === null) {
        return null;
      }
      return parsed.files as ProjectFiles;
    } catch {
      return null;
    }
  }

  private storageKey(): string {
    return `jiki_project_builder_${this.lesson.slug}`;
  }
}

function firstFile(files: ProjectFiles): string {
  return "index.html" in files ? "index.html" : (Object.keys(files)[0] ?? "index.html");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
