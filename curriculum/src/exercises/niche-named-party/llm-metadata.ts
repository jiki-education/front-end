import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore building a startsWith check from scratch by
    comparing two strings character by character, packaged as a single \`handleGuest(name, allowedPrefix)\`
    function that returns a boolean.
  `,

  tasks: {
    "check-the-name": {
      description: `
        Anchor steps:
        1. Define \`handleGuest(name, allowedPrefix)\` using the two inputs directly (no ask/get functions).
        2. Loop over the allowed prefix, comparing each character against the same position in the name,
           returning false on the first mismatch.
        3. Return true if every character matched.

        Length must be computed by iterating (no .length helper is provided), so students reuse
        the pattern from Sign Painter Price. Because the loop runs for the prefix's length, a name
        shorter than the prefix mismatches naturally (name[i] is undefined past the end), so no
        explicit length guard is needed. The trap worth watching is inverting the comparison logic.
      `
    }
  }
};
