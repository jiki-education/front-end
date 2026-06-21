import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise lets a student practise building a complex graphic from variable
    relationships, deriving every element from a single moving point (the flower center).
  `,

  tasks: {
    "draw-scene": {
      description: `
        Common mistakes:
        - Using absolute positions instead of deriving everything from flowerCenter
        - Forgetting to update variables at the start of each iteration (before drawing)
        - Confusing the coordinate system (y=0 is top, y=100 is bottom)
        - Hardcoding values instead of using the relationships in the spec
        - Drawing in the wrong order (sky/ground must come first, or they cover the flower)

        Encourage building one element at a time (flower, then pistil, stem, leaves) and
        using the scrubber to inspect variable values and compare first/last frames.
      `
    }
  }
};
