import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore building a list incrementally with push() while
    conditionally skipping an item (the drink, when it equals "milkshake") based on a comparison.

    Non-obvious context: code checks enforce that exactly one list literal ([]) is created and
    that push() is actually used, so building the result any other way will fail.
  `,

  tasks: {
    "pack-a-lunch": {
      description: `
        Teaching strategy: get the regular (non-milkshake) case working first, then add the
        conditional around only the drink push.

        Common mistakes:
        - Putting the if check around the wrong items (it should only affect the drink)
        - Checking for equality with "milkshake" instead of inequality
      `
    }
  }
};
