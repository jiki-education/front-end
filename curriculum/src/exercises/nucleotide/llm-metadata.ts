import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore string iteration combined with
    input validation via early returns.
  `,

  tasks: {
    "count-nucleotide": {
      description: `
        Anchor steps:
        1. Validate the nucleotide argument; return -1 if it isn't A/C/G/T.
        2. Iterate the strand, returning -1 on the first invalid character.
        3. Count characters matching the target and return the count.

        The two validation gates (the nucleotide argument AND every strand
        character) are easy to half-do; returning 0 instead of -1 for invalid
        input is the common slip.
      `
    }
  }
};
