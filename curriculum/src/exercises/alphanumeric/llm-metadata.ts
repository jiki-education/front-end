import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches string classification by building multiple helper functions
    that work together. Students learn to decompose a problem into reusable parts:
    contains(), isAlpha(), isNumeric(), isAlphanumeric(), and whatAmI().

    Key concepts:
    - Function decomposition and reuse
    - String iteration and character checking
    - Boolean logic and early return patterns
    - Using continue to skip valid iterations
  `,

  tasks: {
    "classify-string": {
      description: `
        Students need to:
        1. Write a contains() function that checks if a character is in a string
        2. Write isAlpha() using contains() to check against all letters
        3. Write isNumeric() using contains() to check against digits
        4. Write isAlphanumeric() using isAlpha() and isNumeric() with continue
        5. Write whatAmI() that calls all three helpers and returns the classification

        Common mistakes:
        - Forgetting to handle the "Alphanumeric" case (strings with BOTH letters and numbers)
        - Checking isAlphanumeric before isAlpha/isNumeric (order matters since alpha-only and numeric-only strings are also alphanumeric)
        - Not using continue in isAlphanumeric — trying to combine conditions in a single if instead
        - Missing characters in the alphabet string (e.g. forgetting lowercase or uppercase)

        Teaching strategy:
        - Start with contains() as the foundation — test it independently
        - Build isAlpha() and isNumeric() next, both using the same pattern
        - For isAlphanumeric(), explain the continue approach: skip chars that pass either check, return false if neither matches
        - For whatAmI(), emphasize that check order matters: alpha and numeric are more specific than alphanumeric
      `
    }
  }
};
