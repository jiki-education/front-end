import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches loops, conditionals, and the modulo operator through
    the Collatz Conjecture. Students learn to use an infinite loop with an
    early return, check even/odd with modulo, and track state with a counter.
  `,

  tasks: {
    "calculate-collatz-steps": {
      description: `
        Students need to:
        1. Initialize a step counter to 0
        2. Use an infinite loop (while true)
        3. Check if the number equals 1 and return the counter if so
        4. Check if the number is even (number % 2 == 0) and divide by 2
        5. Otherwise multiply by 3 and add 1
        6. Increment the counter each iteration

        Common mistakes:
        - Forgetting to handle the base case (number == 1 returns 0)
        - Incrementing the counter before checking if number is 1
        - Using the wrong formula for odd numbers (forgetting +1 or parentheses)
        - Integer division issues in Python (use / not //)

        Teaching strategy:
        - Walk through the example: 12 → 6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1 (9 steps)
        - Start with the simplest case: number 1 returns 0 steps
        - Then try number 16 (only even divisions: 16→8→4→2→1, 4 steps)
        - Then try number 12 (mix of even and odd)
      `
    }
  }
};
