import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    Task progression: task 1 gets the whole linear-search function working
    (all eight scenarios pass at once — there is no partial-credit chunking
    here). The bonus re-runs the same logic under an 8-line limit (5 for
    Python).
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
    },
    "solve-in-eight-lines": {
      description: `
        Bonus: the same contains function in 8 lines or fewer (5 for Python).
        The canonical loop solution already fits exactly. Students over the
        limit have usually added an else branch that returns false inside the
        loop, or intermediate variables — nudge them back to the plain
        loop-if-return shape.
      `
    }
  }
};
