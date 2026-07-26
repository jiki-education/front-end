import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    A refactor exercise. The student arrives with their working (but verbose)
    manual pangram solution from the previous lesson carried into the editor,
    and the goal is to replace the hand-written helpers with the built-in string
    methods this level introduces.
  `,

  tasks: {
    "check-pangram": {
      description: `
        The student's carried-in code has hand-written toLowerCase/includes/indexOf
        helpers. The task is to delete them and use the built-ins:
        1. Replace the manual lowercasing with sentence.toLowerCase().
        2. Replace the manual containment helper with sentence.includes(letter)
           inside the a-z loop; return false on the first miss.
        3. Return true only if all 26 are present.

        Watch for a student who lowercases but keeps calling their old helper, or
        who forgets to reassign the result of toLowerCase (it returns a new string
        rather than mutating in place).
      `
    }
  }
};
