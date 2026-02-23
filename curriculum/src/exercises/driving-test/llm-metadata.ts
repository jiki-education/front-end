import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches string iteration, counting, and early returns.
    Students learn to process characters in a string, make decisions based on
    character values, and use counters to track occurrences.

    Key concepts:
    - Iterating through strings character by character
    - Early returns for immediate failure conditions
    - Counter variables for accumulating values
    - Comparison operators and boolean returns
    - Working with emoji/unicode characters in strings
  `,

  tasks: {
    "did-they-pass": {
      description: `
        Students need to:
        1. Initialize a counter for minor faults
        2. Loop through each character in the marks string
        3. If the character is 💥 (major fault), return false immediately
        4. If the character is ❌ (minor fault), increment the counter
        5. After the loop, return whether minors < 5

        Common mistakes:
        - Forgetting to return false for majors (checking at the end instead)
        - Using >= 5 instead of < 5 for the final check
        - Not initializing the counter to 0
        - Forgetting that strings can contain emoji characters
        - Checking for ✅ explicitly when it's not needed

        Teaching strategy:
        - Emphasize the "early return" pattern for immediate failure
        - Explain why we only need to track minors (✅ doesn't need counting)
        - Show how counters work in loops
        - Discuss the difference between < 5 and <= 4 (equivalent but < 5 is clearer)

        Language-specific notes:
        - All three languages iterate over strings character by character the same way
        - Python uses True/False (capitalized), JS uses true/false
        - Emoji are valid string characters in all three languages
      `
    }
  }
};
