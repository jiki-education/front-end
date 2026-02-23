import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches using conditionals to map string inputs to list outputs.
    Students learn to use if/else if chains to return different lists based on
    the input value. Key concepts: conditionals, returning lists, string comparison.
  `,

  tasks: {
    "map-descriptions": {
      description: `
        Students need to write a function that checks the description string
        and returns the appropriate list of weather components.

        Common mistakes:
        - Forgetting to handle all 7 weather descriptions
        - Returning a single string instead of a list
        - Getting the component order wrong (check the mapping carefully)
        - Misspelling description strings like "rainbow-territory" or "snowboarding-time"

        Teaching strategy:
        - Start with the simplest cases (sunny, dull) that return single-element lists
        - Build up to multi-element lists (miserable, hopeful, etc.)
        - Point out the pattern: some descriptions share components (sun, cloud, rain, snow)
        - Encourage students to test each case individually
      `
    }
  }
};
