import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise introduces Math.randomInt() directly (not wrapped in an exercise function).
    Students generate four random values with chained ranges — each ingredient's range depends
    on a previous ingredient's value. This teaches using return values as inputs to subsequent
    function calls. It bridges from dnd-roll/gold-panning (which use wrapped random functions
    like roll() and pan()) to using the built-in random number generator directly with
    variable-dependent ranges.
  `,

  tasks: {
    "make-random-salad": {
      description: `
        Students need to:
        1. Call Math.randomInt(40, 100) and store the result for leaves
        2. Call Math.randomInt(5, leaves / 5) and store the result for tomatoes
        3. Call Math.randomInt(tomatoes, tomatoes * 2) and store the result for croutons
        4. Call Math.randomInt(1, tomatoes / 2) and store the result for olives
        5. Call makeSalad() with all four values in order: leaves, tomatoes, croutons, olives

        The key insight is that ranges are chained:
        - Tomatoes depend on leaves (max 1 per 5 leaves, soggy/acidic if too many)
        - Croutons depend on tomatoes (at least as many, up to double, to soak up juice)
        - Olives depend on tomatoes (at most half, strong flavour)

        Common mistakes:
        - Using fixed ranges instead of variable-dependent ranges
        - Getting the dependency chain wrong (e.g. using leaves instead of tomatoes for croutons)
        - Passing the arguments to makeSalad() in the wrong order
        - Forgetting to store intermediate values in variables before using them in ranges
        - Not using integer division (leaves / 5 and tomatoes / 2 are auto-floored by Math.randomInt)

        Teaching strategy:
        - Start by having them run the stub code to see how makeSalad() works visually
        - Emphasize that each random call can use previously generated values in its range
        - The order of variable declarations matters — leaves must come before tomatoes, etc.
        - Each ingredient needs its own variable — four separate calls, four separate variables
      `
    }
  }
};
