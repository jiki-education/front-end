import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise lets a student explore combining conditionals with mutable state
    inside a loop: several variables (position, direction, colour) evolve together each
    iteration, with if statements handling boundary bounces.
  `,

  tasks: {
    "rainbow-ball": {
      description: `
        The student keeps position (x, y), direction, and hue variables that update every
        loop iteration; at the canvas edges (0/100) the direction reverses with a fresh
        random speed, and the hue bounces between 0 and 360.

        Common mistakes worth watching for:
        - Testing hueDirection instead of hue for the colour boundary.
        - Using fixed values rather than randomNumber() for the new direction.
        - Wrong sign on a reversed direction.
        - Updating x/y/hue after the boundary checks instead of before.
      `
    }
  }
};
