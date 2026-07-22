import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore decomposing a problem into helper
    functions, including manual case conversion when no built-in toLowerCase is
    available.
  `,

  tasks: {
    "check-pangram": {
      description: `
        Anchor steps:
        1. Normalise the sentence to lowercase (the non-obvious part: with no
           built-in, map via parallel "abc..."/"ABC..." alphabet strings).
        2. For each letter a-z, check it appears; return false on the first miss.
        3. Return true only if all 26 are present.

        Non-letter characters (digits, punctuation, underscores) must be ignored,
        not treated as failures. The classic slip is comparing case-sensitively
        instead of normalising first.
      `
    }
  }
};
