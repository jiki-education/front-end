import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    Task progression: task 1 gets the whole function working (all four
    acronyms pass at once — there is no partial-credit chunking here). The
    bonus re-runs the same logic under a 3-line limit.
  `,

  tasks: {
    "create-acronym-function": {
      description: `
        Common mistakes:
        - Using [1] instead of [0] (strings are 0-indexed)
        - Returning just one character instead of concatenating all three
      `
    },
    "solve-in-three-lines": {
      description: `
        Bonus: the same acronym function in 3 lines or fewer. The concise form
        is the signature line, a single return that concatenates the three
        first characters, and the closing brace. Nudge away from intermediate
        variables (one per letter), which push the count over the limit.
      `
    }
  }
};
