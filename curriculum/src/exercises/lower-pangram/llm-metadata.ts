import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore function decomposition — writing an includes()
    helper and calling it from isPangram(). Input is lowercase-only, so no case conversion is needed.

    Non-obvious context: a code check enforces that isPangram() actually CALLS includes() rather
    than inlining the character-search logic, so a student who reimplements the search inline will
    fail even with correct output.
  `,

  tasks: {
    "check-lower-pangram": {
      description: `
        Common mistakes:
        - Forgetting to return false at the end of includes (after the loop)
        - Iterating through the sentence instead of the alphabet in isPangram
        - Not handling empty string (should return false)
      `
    }
  }
};
