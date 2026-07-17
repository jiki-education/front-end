// The agent's toolset: schemas (OpenAI function-calling format) and the
// client-side executor that runs them against the orchestrator's file state.
// Shapes follow the de-facto coding-agent convention so models drive them
// reliably; run_code stands in for bash (the preview is our execution
// primitive).

import type { Orchestrator } from "./Orchestrator";
import type { ToolSchema } from "./llmClient";

export const MAX_FILES = 20;
export const MAX_FILE_CHARS = 64_000;
export const MAX_TOTAL_CHARS = 256_000;
const MAX_GREP_RESULTS = 100;
const FILENAME_PATTERN = /^[a-zA-Z0-9_\-./]+$/;

export interface ToolExecution {
  label: string;
  detail: string;
  result: string;
  isError: boolean;
}

export const TOOL_SCHEMAS: ToolSchema[] = [
  tool("list_files", "List all files in the project with their sizes.", {}),
  tool("glob", "Find files whose path matches a glob pattern (supports * and **).", {
    pattern: { type: "string", description: "Glob pattern, e.g. *.css" }
  }),
  tool("read_file", "Read a file, optionally a line range. Lines are numbered from 1.", {
    filename: { type: "string" },
    start_line: { type: "number", description: "First line to read (1-based, optional)" },
    end_line: { type: "number", description: "Last line to read (inclusive, optional)" }
  }),
  tool("write_file", "Create a new file or completely overwrite an existing one.", {
    filename: { type: "string" },
    content: { type: "string" }
  }),
  tool(
    "edit_file",
    "Replace an exact string in a file. old_str must appear exactly once - include enough surrounding context to make it unique.",
    {
      filename: { type: "string" },
      old_str: { type: "string" },
      new_str: { type: "string" }
    }
  ),
  tool("delete_file", "Delete a file from the project.", {
    filename: { type: "string" }
  }),
  tool("grep", "Search all files for a regular expression. Returns matching lines as filename:line: text.", {
    pattern: { type: "string" }
  }),
  tool("run_code", "Run the project in the preview and return its console output and any errors.", {})
];

export async function executeTool(
  orchestrator: Orchestrator,
  name: string,
  rawArguments: string
): Promise<ToolExecution> {
  const args = parseArguments(rawArguments);
  if (args === null) {
    return failure(name, "", `Error: could not parse arguments as JSON: ${truncate(rawArguments, 200)}`);
  }

  switch (name) {
    case "list_files":
      return listFiles(orchestrator);
    case "glob":
      return glob(orchestrator, str(args.pattern));
    case "read_file":
      return readFile(orchestrator, str(args.filename), num(args.start_line), num(args.end_line));
    case "write_file":
      return writeFile(orchestrator, str(args.filename), str(args.content));
    case "edit_file":
      return editFile(orchestrator, str(args.filename), str(args.old_str), str(args.new_str));
    case "delete_file":
      return deleteFile(orchestrator, str(args.filename));
    case "grep":
      return grep(orchestrator, str(args.pattern));
    case "run_code":
      return runCode(orchestrator);
    default:
      return failure(name, "", `Error: unknown tool "${name}".`);
  }
}

// Individual tools

function listFiles(orchestrator: Orchestrator): ToolExecution {
  const files = orchestrator.getFiles();
  const listing = Object.entries(files)
    .map(([filename, content]) => `${filename} (${content.split("\n").length} lines, ${content.length} chars)`)
    .join("\n");
  return success("Listed files", "", listing || "No files.");
}

function glob(orchestrator: Orchestrator, pattern: string): ToolExecution {
  const regex = globToRegex(pattern);
  const matches = Object.keys(orchestrator.getFiles()).filter((filename) => regex.test(filename));
  return success(`Matched ${pattern}`, "", matches.join("\n") || "No files match.");
}

function readFile(orchestrator: Orchestrator, filename: string, startLine?: number, endLine?: number): ToolExecution {
  const files = orchestrator.getFiles();
  if (!(filename in files)) {
    return failure(`Read ${filename}`, "", `Error: no file named "${filename}".`);
  }
  const lines = files[filename].split("\n");
  const from = Math.max(1, startLine ?? 1);
  const to = Math.min(lines.length, endLine ?? lines.length);
  const numbered = lines
    .slice(from - 1, to)
    .map((line, index) => `${from + index}: ${line}`)
    .join("\n");
  const rangeNote = startLine !== undefined || endLine !== undefined ? ` (lines ${from}-${to})` : "";
  return success(`Read ${filename}`, rangeNote.trim(), numbered);
}

function writeFile(orchestrator: Orchestrator, filename: string, content: string): ToolExecution {
  const validationError = validateWrite(orchestrator, filename, content);
  if (validationError) {
    return failure(`Write ${filename}`, "", `Error: ${validationError}`);
  }
  const existed = filename in orchestrator.getFiles();
  orchestrator.agentSetFile(filename, content);
  const label = existed ? `Rewrote ${filename}` : `Created ${filename}`;
  return success(label, `${content.split("\n").length} lines`, `${label} (${content.split("\n").length} lines).`);
}

function editFile(orchestrator: Orchestrator, filename: string, oldStr: string, newStr: string): ToolExecution {
  const files = orchestrator.getFiles();
  if (!(filename in files)) {
    return failure(`Edit ${filename}`, "", `Error: no file named "${filename}".`);
  }
  const content = files[filename];
  const occurrences = countOccurrences(content, oldStr);
  if (oldStr === "") {
    return failure(`Edit ${filename}`, "", "Error: old_str must not be empty.");
  }
  if (occurrences === 0) {
    return failure(
      `Edit ${filename}`,
      "",
      "Error: old_str was not found in the file. Read the file and try again with the exact text."
    );
  }
  if (occurrences > 1) {
    return failure(
      `Edit ${filename}`,
      "",
      `Error: old_str appears ${occurrences} times - add surrounding context so it matches exactly once.`
    );
  }
  const updated = content.replace(oldStr, newStr);
  const validationError = validateWrite(orchestrator, filename, updated);
  if (validationError) {
    return failure(`Edit ${filename}`, "", `Error: ${validationError}`);
  }
  orchestrator.agentSetFile(filename, updated);
  return success(`Edited ${filename}`, "", `Edited ${filename}.`);
}

function deleteFile(orchestrator: Orchestrator, filename: string): ToolExecution {
  if (filename === "index.html") {
    return failure("Delete index.html", "", "Error: index.html cannot be deleted - the project needs it.");
  }
  if (!(filename in orchestrator.getFiles())) {
    return failure(`Delete ${filename}`, "", `Error: no file named "${filename}".`);
  }
  orchestrator.agentDeleteFile(filename);
  return success(`Deleted ${filename}`, "", `Deleted ${filename}.`);
}

function grep(orchestrator: Orchestrator, pattern: string): ToolExecution {
  let regex: RegExp;
  try {
    regex = new RegExp(pattern);
  } catch {
    return failure(`Grep ${pattern}`, "", `Error: invalid regular expression: ${pattern}`);
  }
  const results: string[] = [];
  for (const [filename, content] of Object.entries(orchestrator.getFiles())) {
    const lines = content.split("\n");
    for (let i = 0; i < lines.length && results.length < MAX_GREP_RESULTS; i++) {
      if (regex.test(lines[i])) {
        results.push(`${filename}:${i + 1}: ${lines[i]}`);
      }
    }
  }
  return success(
    `Searched for ${truncate(pattern, 40)}`,
    `${results.length} matches`,
    results.join("\n") || "No matches."
  );
}

async function runCode(orchestrator: Orchestrator): Promise<ToolExecution> {
  const { consoleLines, error } = await orchestrator.runForAgent();
  const output = consoleLines.map((line) => `[${line.level}] ${line.text}`).join("\n");
  const parts: string[] = [];
  if (output) {
    parts.push(`Console output:\n${output}`);
  }
  if (error) {
    parts.push(
      `Error: ${error.message}${error.filename ? ` (${error.filename}${error.line ? `:${error.line}` : ""})` : ""}`
    );
  }
  if (parts.length === 0) {
    parts.push("The page ran with no console output and no errors.");
  }
  const detail = error ? "error" : `${consoleLines.length} console lines`;
  return {
    label: "Ran the code",
    detail,
    result: parts.join("\n\n"),
    isError: Boolean(error)
  };
}

// Helpers

function tool(name: string, description: string, properties: Record<string, unknown>): ToolSchema {
  return {
    type: "function",
    function: {
      name,
      description,
      parameters: { type: "object", properties, required: requiredFrom(properties) }
    }
  };
}

function requiredFrom(properties: Record<string, unknown>): string[] {
  return Object.entries(properties)
    .filter(([, schema]) => !String((schema as { description?: string }).description ?? "").includes("optional"))
    .map(([name]) => name);
}

function validateWrite(orchestrator: Orchestrator, filename: string, content: string): string | null {
  if (!FILENAME_PATTERN.test(filename) || filename.includes("..")) {
    return `invalid filename "${filename}".`;
  }
  if (content.length > MAX_FILE_CHARS) {
    return `file too large (${content.length} chars; max ${MAX_FILE_CHARS}).`;
  }
  const files = orchestrator.getFiles();
  const isNew = !(filename in files);
  if (isNew && Object.keys(files).length >= MAX_FILES) {
    return `too many files (max ${MAX_FILES}).`;
  }
  const totalOthers = Object.entries(files)
    .filter(([name]) => name !== filename)
    .reduce((sum, [, existing]) => sum + existing.length, 0);
  if (totalOthers + content.length > MAX_TOTAL_CHARS) {
    return `project too large (max ${MAX_TOTAL_CHARS} chars total).`;
  }
  return null;
}

function globToRegex(pattern: string): RegExp {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*/g, " ")
    .replace(/\*/g, "[^/]*")
    .replace(/ /g, ".*")
    .replace(/\?/g, ".");
  return new RegExp(`^${escaped}$`);
}

function countOccurrences(haystack: string, needle: string): number {
  if (needle === "") {
    return 0;
  }
  let count = 0;
  let index = haystack.indexOf(needle);
  while (index !== -1) {
    count += 1;
    index = haystack.indexOf(needle, index + needle.length);
  }
  return count;
}

function parseArguments(raw: string): Record<string, unknown> | null {
  if (raw.trim() === "") {
    return {};
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    return typeof parsed === "object" && parsed !== null ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function num(value: unknown): number | undefined {
  return typeof value === "number" ? value : undefined;
}

function success(label: string, detail: string, result: string): ToolExecution {
  return { label, detail, result, isError: false };
}

function failure(label: string, detail: string, result: string): ToolExecution {
  return { label, detail, result, isError: true };
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}
