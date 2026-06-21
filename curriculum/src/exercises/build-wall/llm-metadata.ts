import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore nested loops and conditionals by drawing a brick wall.
    The constraint that rectangle can only appear once is what forces the nested-loop structure.
  `,

  tasks: {
    "build-wall": {
      description: `
        The whole exercise is one task: a complete 55-brick wall.

        Anchor steps:
        1. Outer loop over the 10 rows.
        2. Per row, decide even vs odd (row % 2) to pick brick count and start x.
        3. Inner loop draws the bricks, computing positions from the loop counters.

        Note: the student does not see these steps broken down.

        Common stumbling point: hard-coding positions instead of deriving x/y from the
        loop counters, which then breaks the single-rectangle-call constraint.
      `
    }
  }
};
