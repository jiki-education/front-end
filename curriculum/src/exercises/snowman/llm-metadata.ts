import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise lets a student explore variables by setting the position/size values that the (readonly) drawing code uses to render a snowman matching the target image.
  `,

  tasks: {
    "build-snowman": {
      description: `
        Set the variables so the three circles match the target: one shared horizontal centre reused by all three, with the head smallest/top, body medium/middle, base largest/bottom.

        Common mistakes:
        - Forgetting the y-axis increases downward (0 at top, 100 at bottom)
        - Making the head bigger than the body or base
        - Confusing radius with diameter
      `
    }
  }
};
