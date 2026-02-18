import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches string iteration, conditional logic, and mathematical verification.
    Students learn to process a string character by character, skip irrelevant characters (dashes),
    handle special cases (X as check digit), convert characters to numbers, and apply a weighted
    sum algorithm to verify ISBN-10 validity.
  `,

  tasks: {
    "check-isbn": {
      description: `
        Students need to:
        1. Iterate through each character of the ISBN string
        2. Skip dashes (using next/continue)
        3. Handle X only in the last position (multiplier == 1), treating it as 10
        4. Convert digit characters to numbers using string_to_number()
        5. Return false immediately for any invalid character
        6. Maintain a running total using a multiplier that counts down from 10
        7. After the loop, verify exactly 10 digits were processed (multiplier == 0)
        8. Check if total % 11 == 0

        Common mistakes:
        - Forgetting to handle dashes (they should be skipped, not counted)
        - Allowing X in positions other than the last
        - Not checking that exactly 10 digits were found after processing
        - Forgetting to decrement the multiplier after processing each digit
        - Not returning false for non-digit, non-dash, non-X characters

        Teaching strategy:
        - Start with the simple valid case: "3-598-21508-8"
        - Walk through the weighted sum calculation step by step
        - Then introduce the X check digit case
        - Then handle edge cases: too short, too long, invalid characters
      `
    }
  }
};
