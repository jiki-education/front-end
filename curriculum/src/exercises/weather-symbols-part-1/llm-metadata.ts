import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore mapping a string input to a
    list output via an if/else-if chain.
  `,

  tasks: {
    "map-descriptions": {
      description: `
        Branch on the description and return the matching component list.

        Watch for: returning a single string instead of a list, wrong
        component order within a list, and typos in the multi-word
        descriptions ("rainbow-territory", "snowboarding-time").
      `
    }
  }
};
