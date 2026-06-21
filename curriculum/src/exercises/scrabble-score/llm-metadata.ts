import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise lets a student explore building a lookup dictionary from grouped data, then using it for accumulated scoring.
  `,

  tasks: {
    "create-letter-values-function": {
      description: `
        Build the dictionary from the provided list of [letterGroup, pointValue] pairs (nested loop over the group string), rather than typing out 26 keys by hand.

        Common mistakes: hand-typing the whole dictionary instead of deriving it; wrong indexing into each pair; forgetting to return the dictionary.
      `
    },
    "single-letters": {
      description: `
        Builds on the dictionary: look up one letter's score. The trap is the keys are uppercase, so the input letter must be uppercased before lookup.
      `
    },
    words: {
      description: `
        Extends scoring to a full word by accumulating per-letter scores.

        Common mistakes: overwriting instead of adding; not initialising the accumulator to 0.
      `
    },
    "edge-cases": {
      description: `
        Empty string and full-alphabet checks. These pass automatically if the accumulator starts at 0 and the loop is correct, so no special-casing is needed.
      `
    }
  }
};
