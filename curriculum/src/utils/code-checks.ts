import type { InterpretResult } from "@jiki/interpreters";
import type { Language } from "../types";

/**
 * Counts non-empty, non-comment lines of code
 * Filters out:
 * - Empty lines (whitespace only)
 * - Comment-only lines (language-specific)
 *
 * Comment handling:
 * - JavaScript: single-line (//) and multi-line (slash-star ... star-slash) comments
 * - Jikiscript: single-line (//) comments only (no multi-line)
 * - Python: single-line (#) comments
 */
export function countLinesOfCode(sourceCode: string, language: Language): number {
  const lines = sourceCode.split("\n");

  // Track multi-line comment state for JavaScript
  let inMultiLineComment = false;

  const nonEmptyLines = lines.filter((line) => {
    const trimmed = line.trim();

    // Empty line
    if (trimmed === "") return false;

    // Language-specific comment handling
    switch (language) {
      case "javascript":
        // Check for multi-line comment start
        if (trimmed.includes("/*")) {
          inMultiLineComment = true;
        }

        // If in multi-line comment, skip this line
        if (inMultiLineComment) {
          // Check if comment ends on this line
          if (trimmed.includes("*/")) {
            inMultiLineComment = false;
          }
          return false;
        }

        // Single-line comments
        if (trimmed.startsWith("//")) return false;
        break;

      case "jikiscript":
        // Jikiscript only has // comments (no multi-line)
        if (trimmed.startsWith("//")) return false;
        break;

      case "python":
        // Comments starting with #
        if (trimmed.startsWith("#")) return false;
        break;
    }

    return true;
  });

  return nonEmptyLines.length;
}

/**
 * Gets the source code from InterpretResult
 * This assumes the interpreters package has added sourceCode to meta
 *
 * NOTE: The interpreters package needs to add sourceCode: string to InterpretResult.meta
 * Until then, we use a type assertion to access it
 */
export function getSourceCode(result: InterpretResult): string {
  // Defensive - return empty string if not available yet
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (result.meta as any).sourceCode ?? "";
}
