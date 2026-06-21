import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise lets a student use a loop plus a position variable to draw a
    repeated shape, rather than writing the rectangle call five times. The
    constraint is that rectangle may appear only once in their code.

    Anchor steps:
    1. Use a counter variable to derive each brick's x position.
    2. Inside repeat(5), advance the counter so x steps 0, 20, 40, 60, 80.
    3. Draw the brick once inside the loop.
  `,

  tasks: {
    "finish-wall": {
      description: `
        Non-obvious traps to watch for:
        - The "rectangle only once" rule means a five-rectangle solution is disallowed, not just inelegant.
        - Off-by-one in the position counter is the usual failure (x must reach 80, not 100).
      `
    }
  }
};
