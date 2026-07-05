import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    The single-rectangle-call constraint is the crux: it forces the student away from
    hard-coded calls and into a nested-loop structure. Enforced by a code check (rectangle
    must appear exactly once in source) plus a runtime check that exactly 55 bricks are drawn.
  `,

  tasks: {
    "build-wall": {
      description: `
        The whole exercise is one task: a complete 55-brick wall.

        Anchor steps:
        1. Outer loop over the 10 rows, building from the bottom up (the bottom row is
           laid first, like a real bricklayer). The y position starts at the bottom and
           moves up each row.
        2. Per row, decide even vs odd (row % 2) to pick brick count and start x. The
           bottom row is a full row of 5 bricks; offset rows have 6 (one hanging off each side).
        3. Inner loop draws the bricks, computing positions from the loop counters.

        Note: the student does not see these steps broken down.

        Common stumbling point: hard-coding positions instead of deriving x/y from the
        loop counters, which then breaks the single-rectangle-call constraint.
      `
    }
  }
};
