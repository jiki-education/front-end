import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise lets a student explore using Math.randomInt() directly (not a wrapped
    exercise function) with chained ranges, where each value's range depends on a
    previously generated value. It bridges from dnd-roll/gold-panning (wrapped random
    functions like roll()/pan()) to the built-in generator with variable-dependent ranges.
  `,

  tasks: {
    "make-random-salad": {
      description: `
        The student generates four ingredient amounts in order, each later one's range
        depending on an earlier value (tomatoes from leaves, croutons and olives from
        tomatoes), then passes all four to makeSalad().

        Common mistakes worth watching for:
        - Using fixed ranges instead of variable-dependent ones.
        - Getting the dependency chain wrong (e.g. basing croutons on leaves not tomatoes).
        - Passing the makeSalad() arguments in the wrong order.
        - Not storing each value in its own variable before using it in a later range, so
          declarations end up out of order.
      `
    }
  }
};
