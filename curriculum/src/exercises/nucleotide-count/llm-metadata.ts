import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore counting into a dictionary while
    iterating a string, with validation via early return.
  `,

  tasks: {
    "count-nucleotides": {
      description: `
        Anchor steps:
        1. Initialise a counts dictionary with A/C/G/T all at 0.
        2. Iterate the strand, returning false on the first invalid character.
        3. Otherwise increment the matching key and return the dictionary.

        Dynamic key access (counts[char] = counts[char] + 1) is the new idea
        here. Watch for incrementing without first validating, and for missing
        the false return on bad input.
      `
    }
  }
};
