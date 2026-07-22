import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise lets a student practise calling functions in sequence, with no
    variables, loops, or conditionals. It is typically their first Space Invaders exercise.
  `,

  tasks: {
    "shoot-the-aliens": {
      description: `
        The laser starts at position 0 (far left) and the aliens are at columns 1, 3, 6, 9.

        Common mistakes (each ends the run with an error/loss):
        - Miscounting move() calls between aliens
        - Shooting when not directly below an alien
        - Moving off the right edge
        - Forgetting they start at position 0, not 1

        If they're stuck, ask them to count positions out loud or track position in comments.
      `
    }
  }
};
