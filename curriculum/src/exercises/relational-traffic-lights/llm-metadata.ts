import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise revisits the earlier traffic light, now requiring positions and sizes
    to be derived relationally so the whole light rescales when \`radius\` changes.
  `,

  tasks: {
    "build-relational-traffic-lights": {
      description: `
        The lights all share x = \`center\` (a fixed 50); the vertical layout is built
        around \`center\` and \`radius\`: yellowY = center, redY = center - radius * 2,
        greenY = center + radius * 2 (so lights are 2*radius apart). The housing is
        derived too: housingX = center - radius * 2, housingY = center - radius * 4,
        housingWidth = radius * 4, housingHeight = radius * 8.

        Common mistakes worth watching for:
        - Hardcoding values instead of expressing them via center and radius, so changing
          \`radius\` doesn't rescale.
        - Spacing the lights by something other than 2*radius.
        - Mis-sizing or mis-placing the housing relative to the lights.
      `
    }
  }
};
