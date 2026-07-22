import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    The student's first drawing exercise: explore the rectangle function and the
    canvas coordinate system by drawing three rectangles to fill holes in a wall.
  `,

  tasks: {
    "fill-holes": {
      description: `
        Non-obvious trap to watch for:
        - rectangle takes (left, top, width, height), not (left, top, right, bottom);
          students who treat the last two args as a corner mis-size the rectangles.
      `
    }
  }
};
