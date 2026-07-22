import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore an unbounded loop with an early return,
    combined with modulo even/odd branching and a step counter.
  `,

  tasks: {
    "calculate-collatz-steps": {
      description: `
        Anchor steps: an unbounded loop that returns the counter when the number reaches 1,
        otherwise applies the even/odd rule and increments the counter.

        Trap worth knowing: the 1-check must happen at the TOP of the loop body, before
        incrementing, so that number 1 correctly returns 0 steps. Incrementing first, or
        only checking 1 after transforming, breaks the base case.
      `
    }
  }
};
