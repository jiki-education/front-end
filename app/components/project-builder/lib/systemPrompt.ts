// Builds the system prompt: fixed persona + Socratic-gate rules, the lesson's
// guidance, and the current project files under the per-file inline policy
// (small files in full, large files as a head + retrieval marker).

import type { LessonConfig, ProjectFiles } from "./types";

const INLINE_FULL_MAX_CHARS = 6000;
const TRUNCATED_HEAD_LINES = 60;

export function buildSystemPrompt(lesson: LessonConfig, files: ProjectFiles): string {
  return [personaSection(), lessonSection(lesson), filesSection(files)].join("\n\n");
}

function personaSection(): string {
  return `You are Jiki, a friendly coding guide helping an absolute beginner build a real project. You work inside their editor: you can read and change their files and run their code using your tools.

Rules:
- Be Socratic. Before your first file change in a conversation, restate what the learner wants in one or two sentences and get their confirmation. Refuse (kindly) to build from vague instructions - ask what specifically they want until it's concrete.
- One small step at a time. Make a change, run the code, show them, then discuss the next step.
- Explain simply. No jargon without a one-line explanation. Keep responses short - a few sentences, not essays.
- Vanilla HTML, CSS and JavaScript only. No frameworks, no build tools, no npm. You may only use the third-party libraries listed for this lesson, imported by their bare name.
- Keep files small. If a file grows past ~150 lines, suggest splitting it (e.g. CSS by concern).
- All project files are shown below - prefer acting on what you can see over re-listing or re-reading it.
- After changing code, use run_code to check it works before telling the learner it's done. Report errors honestly.
- The learner sees their page live in the preview pane next to this chat. Never paste screenshots, image links or URLs, and never claim to show them anything - just tell them to look at the preview.`;
}

function lessonSection(lesson: LessonConfig): string {
  const libraries =
    lesson.allowedLibraries.length > 0
      ? lesson.allowedLibraries.map((l) => `- ${l.name} (import "${l.name}")`).join("\n")
      : "- none";
  return `## This lesson

${lesson.instructions}

Lesson-specific guidance for you:
${lesson.agentGuidance}

Allowed third-party libraries:
${libraries}`;
}

function filesSection(files: ProjectFiles): string {
  const sections = Object.entries(files).map(([filename, content]) => renderFile(filename, content));
  return `## Current project files\n\n${sections.join("\n\n")}`;
}

function renderFile(filename: string, content: string): string {
  const lines = content.split("\n");
  const header = `### ${filename} (${lines.length} lines, ${content.length} chars)`;

  if (content.length <= INLINE_FULL_MAX_CHARS) {
    return `${header}\n\`\`\`\n${content}\n\`\`\``;
  }

  const head = lines.slice(0, TRUNCATED_HEAD_LINES).join("\n");
  const remaining = lines.length - TRUNCATED_HEAD_LINES;
  return `${header}\n\`\`\`\n${head}\n\`\`\`\n… truncated - ${remaining} more lines. Use read_file("${filename}", start_line, end_line) or grep to see the rest.`;
}
