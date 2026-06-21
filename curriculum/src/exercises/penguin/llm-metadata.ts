import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore mirroring shapes across a vertical
    centerline to complete a symmetrical drawing.
  `,

  tasks: {
    "draw-penguin": {
      description: `
        The student mirrors each left-side element across x=50: the mirrored x is
        100 - leftX, the y stays the same. The nose is the one trap worth flagging
        early: the existing triangle's MIDDLE point must be changed, not a new
        triangle added.
      `
    }
  }
};
