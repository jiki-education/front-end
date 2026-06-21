import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise lets a student explore the circle function, drawing three circles to build a snowman matching the target image.
  `,

  tasks: {
    "build-snowman": {
      description: `
        Draw three centred circles (head smallest/top, body medium/middle, base largest/bottom).

        Common mistakes:
        - Treating cx/cy as the top-left rather than the centre
        - Confusing radius with diameter
        - Getting the three sizes in the wrong order
      `
    }
  }
};
