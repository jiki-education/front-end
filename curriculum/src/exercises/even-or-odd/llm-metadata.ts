import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    Task progression: task 1 gets the whole function working (even/odd/zero
    all pass at once — there is no partial-credit chunking here). The bonus
    re-runs the same logic under a line-count limit.
  `,

  tasks: {
    "identify-even-or-odd": {
      description: `
        Non-obvious traps to watch for:
        - 0 is even (a common edge case students second-guess).
        - The return strings are capitalised ("Even"/"Odd"), not lowercase.
      `
    },
    "solve-in-six-lines": {
      description: `
        Bonus: same logic in 6 lines or fewer. Nudge toward the early-return
        pattern (no else needed, since return exits the function).
      `
    }
  }
};
