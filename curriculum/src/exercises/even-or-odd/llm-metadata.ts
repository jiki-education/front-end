import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise lets a student explore the remainder operator (%) and a simple
    conditional return: decide whether a number is "Even" or "Odd".
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
