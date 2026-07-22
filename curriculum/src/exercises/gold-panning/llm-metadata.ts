import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise lets a student combine a function's return value with the loop +
    accumulator pattern: a running total starts at 0 and grows by pan()'s return
    value each iteration, then sell() is called once with the total.

    Anchor steps:
    1. Initialise a total variable to 0.
    2. In repeat(5), add pan()'s return value to the total.
    3. After the loop, call sell() with the total.
  `,

  tasks: {
    "pan-and-sell": {
      description: `
        Non-obvious traps to watch for:
        - pan() returns a value that must be captured into the total; calling it for its
          side effect alone loses the nuggets.
        - sell() belongs after the loop, not inside it (otherwise it sells each iteration).
      `
    }
  }
};
