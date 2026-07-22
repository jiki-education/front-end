import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore building a startsWith check from
    scratch by comparing two strings character by character.
  `,

  tasks: {
    "check-the-name": {
      description: `
        Anchor steps:
        1. Get the name and the allowed start, then write a startsWith check.
        2. Guard: if the prefix is longer than the name, it can't match.
        3. Compare each prefix character against the same position in the name,
           returning false on the first mismatch.
        4. Let the person in or turn them away based on the result.

        Length must be computed by iterating (no .length helper is provided), so
        students reuse the pattern from Sign Painter Price. The two traps worth
        watching: missing the prefix-longer-than-name guard (the empty-name
        scenario exposes this), and inverting the comparison logic.
      `
    }
  }
};
