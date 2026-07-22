import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore the linear search pattern:
    iterating a list and returning a boolean once a match is found.
  `,

  tasks: {
    "search-for-tile": {
      description: `
        Anchor steps:
        1. Loop through each tile in the haystack.
        2. Return true immediately when a tile matches the needle.
        3. Return false only AFTER the loop, once all tiles have been checked.

        The most common trap is returning false inside the loop (which bails
        after the first non-match instead of checking the rest). Use that
        misconception as the teaching lever if their loop returns false early.
      `
    }
  }
};
