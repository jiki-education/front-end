import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise lets a student practise flip-book animation through variable mutation:
    tracking position, size and color in variables and updating them each iteration so the
    scene redraws on top of itself.
  `,

  tasks: {
    "draw-scene": {
      description: `
        Common mistakes:
        - Initializing the animated variables inside the loop (resets them each iteration)
        - Updating variables after drawing instead of before (animation runs one frame behind)
        - Wrong draw order (the sun ends up hidden behind the sky rectangle)
        - Mixing up the two color systems: rgb is 0-255 per channel; hsl is hue 0-360,
          saturation/luminosity 0-100
      `
    }
  }
};
