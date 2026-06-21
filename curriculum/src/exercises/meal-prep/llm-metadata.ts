import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore filtering one list based on
    membership in another list.
  `,

  tasks: {
    "create-shopping-list": {
      description: `
        Anchor steps:
        1. Loop through each recipe item.
        2. Check whether the item is NOT in the fridge.
        3. If missing, add it to the shopping list and return that list.

        A membership check is the crux: students may try comparing the two lists
        directly, or forget to negate (ending up with what they already have).
      `
    }
  }
};
