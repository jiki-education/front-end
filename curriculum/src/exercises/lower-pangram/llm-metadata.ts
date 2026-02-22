import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches function decomposition — breaking a problem into smaller helper functions.
    Students write an includes() function to check for a character in a string, then use it
    inside isPangram() to check if a sentence contains every letter of the alphabet.
    Key concepts: writing multiple functions, calling helper functions, string iteration, early return.
    This is a lowercase-only version — no case conversion needed.
  `,

  tasks: {
    "check-lower-pangram": {
      description: `
        Students need to write two functions:
        1. includes(str, target) - checks if a character exists in a string
        2. isPangram(sentence) - checks if all 26 lowercase letters appear in the sentence

        The key learning point is using includes() inside isPangram() rather than
        inlining the character search logic. A code check enforces this.

        Common approaches:
        1. includes: iterate through each character, compare, return true on match, false at end
        2. is_pangram: iterate through "abcdefghijklmnopqrstuvwxyz", call includes for each letter

        Common mistakes:
        - Forgetting to return false at the end of includes (after the loop)
        - Not using the includes function (inlining the logic instead)
        - Iterating through the sentence instead of the alphabet in isPangram
        - Forgetting that empty string should return false
      `
    }
  }
};
