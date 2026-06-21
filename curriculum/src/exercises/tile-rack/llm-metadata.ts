import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise lets a student practise tracking a position while iterating a string,
    combining a for-each loop (which gives no index) with a manually tracked counter, plus
    early return on a match.
  `,

  tasks: {
    "find-tile-position": {
      description: `
        Common mistakes:
        - Forgetting to increment the position counter
        - Incrementing before the comparison (off-by-one)
        - Returning the "not found" error inside the loop instead of after it
        - Returning the matched letter instead of its position

        If stuck, walk them through "ABCDE" looking for "C" tracking position by hand, then
        the "Z" case to show the after-the-loop error path.
      `
    }
  }
};
