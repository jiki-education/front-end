import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches list comparison and filtering. Students learn to check
    membership in a list and build a new list based on conditions. This is a
    straightforward exercise that introduces the concept of filtering one list
    based on another.

    Key concepts:
    - List iteration with for-each loops
    - Checking if an element exists in a list
    - Building a result list using push()
    - Writing helper functions for reusable logic
  `,

  tasks: {
    "create-shopping-list": {
      description: `
        Students need to:
        1. Write a helper function to check if an item exists in a list (in_list)
        2. Loop through each recipe item
        3. Check if the item is NOT in the fridge
        4. If not in fridge, add it to the shopping list using push()
        5. Return the shopping list

        Common mistakes:
        - Trying to compare lists directly (lists can't be compared with == in Jiki)
        - Forgetting to use the 'not' keyword when checking if item is missing
        - Not returning the result from push() (push returns the new list)
        - Mixing up the fridge and recipe parameters

        Teaching strategy:
        - Encourage writing the in_list helper function first
        - Test the helper function with simple cases before moving on
        - Emphasize that push() returns a new list, so you need to reassign
        - Walk through the real-world analogy: checking each ingredient against your fridge

        Language-specific notes:
        - Jikiscript: Use 'not in_list(...)' for negation
        - JavaScript: Use '!inList(...)' for negation, or use .includes() natively
        - Python: Use 'not in_list(...)' or 'item not in fridge' natively
      `
    }
  }
};
