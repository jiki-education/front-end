import { marked } from "marked";

/**
 * An exercise's instructions rendered to HTML.
 *
 * The public page shows the brief in full — it's the exercise's pitch, and a
 * truncated version reads like a broken page rather than a teaser. What's held
 * back is the editor, not the reading.
 */
export function exerciseInstructionsHtml(instructions: string): string {
  return marked.parse(instructions.trim(), { async: false });
}
