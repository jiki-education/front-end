import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches problem decomposition through multiple helper functions.
    Students implement a Caesar cipher encoder by breaking it into three functions:
    indexOf (find a character's position), shiftLetter (shift one letter),
    and encode (process a full message). Key concepts: function composition,
    string indexing, modulo for wrap-around, string iteration and building.
  `,

  tasks: {
    "encode-message": {
      description: `
        Students need to write three functions that work together:

        1. indexOf(text, target) - finds the position of a character in a string.
           Returns -1 if not found. This is a common helper pattern.

        2. shiftLetter(letter, amount) - shifts a single letter by the given amount.
           Uses indexOf to find position in the alphabet, then uses modulo (% 26)
           to wrap around. Non-alphabet characters are returned unchanged.

        3. encode(message, shift) - iterates through the message, keeping spaces
           as-is and shifting all other characters using shiftLetter.

        Common mistakes:
        - Forgetting to handle wrap-around (use % 26)
        - Not handling spaces correctly (they should pass through unchanged)
        - Trying to solve it all in one function instead of breaking it down
        - Off-by-one errors in indexOf

        Guide students toward decomposition: if they try to write everything
        in encode, suggest they first solve the simpler problem of shifting
        a single letter, and before that, finding a letter's position.
      `
    }
  }
};
