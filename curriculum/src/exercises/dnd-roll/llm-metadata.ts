import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This is the first exercise where students must store return values in variables.
    Students roll three dice by calling roll(), store each result, announce each one,
    then use arithmetic to combine two values and pass results to strike().
    The key insight: you cannot solve this by nesting function calls because each
    return value is needed in multiple places (both announce and strike).
  `,

  tasks: {
    "roll-and-strike": {
      description: `
        Students need to:
        1. Call roll(20), roll(6), roll(4) and store each result in a variable
        2. Call announce() three times with each stored value
        3. Add the damage and bonus variables together
        4. Call strike() with the attack variable and total damage

        Common mistakes:
        - Calling roll() without storing the result (the value is lost)
        - Calling roll() again expecting the same number (each call returns a new value)
        - Forgetting to add base damage and bonus before passing to strike()
        - Passing individual damage values to strike() instead of the sum

        Teaching strategy:
        - Emphasize that roll() gives back a NEW number each time
        - Show that you must "catch" the return value with a variable
        - The announce step proves they stored the values correctly
        - The addition step shows variables can be combined with arithmetic
      `
    }
  }
};
