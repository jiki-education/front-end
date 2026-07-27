import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    Two independent functions, encode and decode, each gated by its own six scenarios. They can be
    solved in either order; one working function passes its task regardless of the other. The
    student sees no sub-step breakdown, so orient help around the two traps below.
  `,

  tasks: {
    encode: {
      description: `
        Traps that aren't obvious from the solution: a count of 1 must NOT be written in front of a
        single character, and the final run has to be flushed after the loop ends. Whitespace is an
        ordinary character.
      `
    },
    decode: {
      description: `
        Trap: a multi-digit count must be accumulated across consecutive digits before expanding, so
        "12W" is twelve Ws, not one W then two Ws. A character with no count in front repeats once.
      `
    }
  }
};
