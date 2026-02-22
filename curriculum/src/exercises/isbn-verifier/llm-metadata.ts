import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore iterating through a string character by character,
    applying conditional logic to each character, and using a weighted sum to verify data.

    The student writes an isValidIsbn function that checks whether an ISBN-10 string is valid.
    ISBN-10s are 10-digit strings, optionally separated by dashes (e.g. "3-598-21508-8").
    Validation uses a weighted sum: each digit is multiplied by a weight counting down from 10 to 1,
    and the total must be divisible by 11. The last digit may be "X" representing 10.
    Any non-digit, non-dash, non-X characters make the ISBN invalid.

    To complete this exercise, the student needs to:
    1. Iterate through each character of the ISBN string
    2. Skip dashes using continue
    3. Convert digit characters to numbers
    4. Track a running total using a multiplier counting down from 10
    5. Check if the total is divisible by 11
    6. Handle "X" only when it's the last digit (multiplier is 1), treating it as 10
    7. Return false for any invalid character
    8. After the loop, verify exactly 10 digits were processed (multiplier === 0)
  `,

  tasks: {
    "validate-basic-isbn": {
      description: `
        The student needs to complete steps 1-5. Note: the student does not see these steps broken down.
      `
    },
    "handle-x-check-digit": {
      description: `
        The student has got steps 1-5 working. They now need to complete step 6. Note: the student does not see these steps broken down.
      `
    },
    "handle-edge-cases": {
      description: `
        The student has got steps 1-6 working. They now need to complete steps 7-8. Note: the student does not see these steps broken down.
      `
    }
  }
};
