import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise lets a student explore object creation, property access/mutation, and collision detection. It builds on the Boundaried Ball exercise by adding breakout-style blocks and a game loop that ends with break once all blocks are smashed.
  `,

  tasks: {
    "add-and-smash-blocks": {
      description: `
        Create the blocks in a loop, reuse the wall-bouncing logic from the previous exercise, then add ball/block collision detection (skip already-smashed blocks, check alignment, reverse y-velocity, set smashed = true), and break the loop once all blocks are smashed.

        Common mistakes:
        - Not skipping already-smashed blocks during collision checks (use continue)
        - Wrong block-positioning formula
        - Forgetting to break when all blocks are smashed

        Teaching strategy: build incrementally — block creation, then bouncing, then collision, then the game-over check.
      `
    },
    "different-dimensions": {
      description: `
        Bonus task that re-runs with a larger ball radius (4) and block height (10) to catch hardcoded magic numbers. The fix is to use ball.radius and block.height rather than literals like 3 and 7.
      `
    }
  }
};
