import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise practises the string .includes() method for membership checks,
    combined with string iteration and input validation via early returns.
  `,

  tasks: {
    "count-nucleotide": {
      description: `
        Anchor steps:
        1. Validate the nucleotide argument with "ACGT".includes(nucleotide);
           return -1 if it isn't A/C/G/T.
        2. Iterate the strand, returning -1 on the first character that fails the
           same "ACGT".includes(...) check.
        3. Count characters matching the target and return the count.

        The two validation gates (the nucleotide argument AND every strand
        character) are easy to half-do; returning 0 instead of -1 for invalid
        input is the common slip.
      `
    }
  }
};
