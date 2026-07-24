// Core types for the project-builder prototype.

export type ProjectFiles = Record<string, string>;

export interface AllowedLibrary {
  name: string;
  path: string;
}

export interface LessonConfig {
  slug: string;
  title: string;
  instructions: string;
  agentGuidance: string;
  startingFiles: ProjectFiles;
  allowedLibraries: AllowedLibrary[];
}

export interface ConsoleLine {
  level: "log" | "warn" | "error" | "info";
  text: string;
}

export interface PreviewError {
  message: string;
  filename?: string;
  line?: number;
}

// A single entry in the chat transcript. Assistant prose and tool activity
// interleave in one flat list, rendered in order.
export type TranscriptItem =
  | { kind: "user"; id: string; content: string }
  | { kind: "assistant"; id: string; content: string }
  | {
      kind: "tool";
      id: string;
      name: string;
      label: string;
      detail: string;
      status: "running" | "done" | "error";
    }
  | { kind: "notice"; id: string; content: string };

// OpenAI-compatible message shapes used with OpenRouter.
export interface ChatToolCall {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
}

export type ChatCompletionMessage =
  | { role: "system"; content: string }
  | { role: "user"; content: string }
  | { role: "assistant"; content: string | null; tool_calls?: ChatToolCall[] }
  | { role: "tool"; tool_call_id: string; content: string };
