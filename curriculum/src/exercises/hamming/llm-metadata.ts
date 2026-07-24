import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    Student writes a function comparing two equal-length strings position by position and counting
    differences, then (bonus) shrinks it to fit a line-count limit.
  `,

  tasks: {
    "calculate-hamming-distance": {
      description: `
        The non-obvious trap: the loop iterates one string, but the index used to reach into the
        second string must stay in sync. Off-by-one errors (incrementing the index before vs. after
        the comparison) are the usual stumble — walking through a short pair of strands by hand helps
        spot this.
      `
    },
    "solve-in-eleven-lines": {
      description: `
        Bonus: fit the solution within 11 lines (8 for Python). The reference solution already hits
        this exactly, so the student mainly needs to drop unnecessary intermediate variables/lines
        rather than restructure the approach.
      `
    }
  }
};
