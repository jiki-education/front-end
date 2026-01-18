import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This is a foundational exercise teaching list iteration and boolean returns.
    Students learn to search through a list for a matching value and return
    the appropriate boolean result. This is often one of the first exercises
    involving both loops and conditional logic together.

    Key concepts:
    - List/array iteration with for-each loops
    - String comparison
    - Early returns (returning true when found)
    - Default returns (returning false at the end)
    - Boolean return values
  `,

  tasks: {
    "check-guest-list": {
      description: `
        Students need to:
        1. Loop through each name in the guest list
        2. Compare each name to the person being looked for
        3. Return true immediately when a match is found
        4. Return false after the loop if no match was found

        Common mistakes:
        - Returning false inside the loop (should only return false AFTER the loop)
        - Not returning anything (function returns undefined)
        - Using assignment (=) instead of comparison (==)
        - Forgetting the return statements

        Teaching strategy:
        - Connect to real-world experience: "How would YOU check a physical list?"
        - Emphasize the two key decision points:
          1. When do we say "yes, you're in"? (when we find the name)
          2. When do we say "no, you're not in"? (only after checking everyone)
        - Walk through the loop iteration step by step
        - Highlight why returning false inside the loop is wrong

        This is a critical pattern that appears in many exercises:
        - Search for something in a collection
        - Return early when found
        - Return default at the end if not found

        Language-specific notes:
        - All three languages use similar for-each loop syntax
        - Python uses True/False (capitalized)
        - JavaScript uses === for strict equality (though == works here)
      `
    }
  }
};
