import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise introduces the repeat loop by having students shoot aliens arranged
    in a regular pattern (every other column, 3 rows deep). The key insight is recognizing
    that the same sequence of actions (move, move, shoot, shoot, shoot) repeats for each
    column of aliens.

    Students must solve it in 7 lines of code or fewer, forcing them to use a repeat loop
    rather than writing out every move and shoot individually.
  `,

  tasks: {
    "repeat-shoot": {
      description: `
        Students need to:
        1. Recognize the pattern: aliens at every other column (2, 4, 6, 8, 10)
        2. Identify the repeating action: move twice, shoot three times
        3. Count the groups: 5 columns of aliens = repeat(5)
        4. Write the loop: repeat(5) { move(); move(); shoot(); shoot(); shoot(); }

        Common mistakes:
        - Not recognizing the pattern and trying to write individual calls (hits LOC limit)
        - Wrong repeat count (4 instead of 5, or 10 instead of 5)
        - Wrong order in the loop body (shooting before moving to an alien column)
        - Putting move() after shoot() instead of before

        Teaching strategy:
        - Ask students what they see on screen - where are the aliens?
        - Help them describe the pattern in words first
        - Ask: "What do you do for each group of aliens?"
        - Remind them the laser starts at position 0 which has no aliens
        - The repeat loop syntax is: repeat(n) { ... }
      `
    }
  }
};
