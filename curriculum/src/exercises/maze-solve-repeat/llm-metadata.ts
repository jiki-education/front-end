import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore the repeat loop by refactoring a verbose, working
    maze solution down to a line target (22 in JS) without changing behaviour.

    Non-obvious context the student can't see:
    - The corridors (groups of consecutive move() calls) are of length 6, 2, 1, 1, 4, 3, 5.
    - repeat(2) is NOT shorter than two move() calls, so the group of 2 and the single moves
      should stay as individual calls. Only groups of 3+ benefit from a repeat.
    - A code check bands the feedback: 2+ lines over usually means runs of move() still need
      collapsing; exactly 1 over usually means a too-short repeat that costs more than it saves.
  `,

  tasks: {
    "solve-maze-with-repeat": {
      description: `
        Common mistakes:
        - Putting turn functions inside the repeat block (turns must stay between loops)
        - Off-by-one repeat counts (e.g. repeat(5) instead of repeat(6))
        - Wrapping the group of 2 in a repeat, which actually adds a line
        - Removing or reordering turn calls while refactoring
      `
    }
  }
};
