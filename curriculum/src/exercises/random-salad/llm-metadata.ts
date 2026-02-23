import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise introduces Math.randomInt() directly (not wrapped in an exercise function).
    Students generate four random values with different ranges and pass them all to a single
    function call. No loop is involved — it's a straight sequence of random generation and use.
    This bridges from dnd-roll/gold-panning (which use wrapped random functions like roll() and
    pan()) to using the built-in random number generator directly.
  `,

  tasks: {
    "make-random-salad": {
      description: `
        Students need to:
        1. Call Math.randomInt(20, 100) and store the result for leaves
        2. Call Math.randomInt(5, 20) and store the result for tomatoes
        3. Call Math.randomInt(10, 50) and store the result for croutons
        4. Call Math.randomInt(1, 10) and store the result for dressing
        5. Call makeSalad() with all four values in order

        Common mistakes:
        - Using the wrong range for an ingredient
        - Passing the arguments to makeSalad() in the wrong order
        - Calling Math.randomInt() inside the makeSalad() call instead of storing first
          (this works but the exercise is designed to practice storing return values)
        - Using the same range for all ingredients

        Teaching strategy:
        - This is their first time using Math.randomInt() directly
        - Emphasize that each call has different min/max values
        - Show that the pattern is the same as roll() from dnd-roll, just a different function name
        - Each ingredient needs its own variable — four separate calls, four separate variables
      `
    }
  }
};
