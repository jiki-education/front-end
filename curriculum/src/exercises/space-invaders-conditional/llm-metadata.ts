import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise introduces if-statements (conditionals) in a Space Invaders context.
    Students already know repeat loops from previous exercises. Now they learn to
    conditionally execute code based on a boolean check: is_alien_above().
    The key insight is that not every column has an alien, so they must check before shooting.
    Five different alien layouts prevent hard-coding specific shoot positions.
  `,

  tasks: {
    "conditional-shoot": {
      description: `
        Students need to:
        1. Recognize they need to check each column as they move right
        2. Use is_alien_above() to detect whether to shoot
        3. Use an if statement to conditionally call shoot()
        4. Wrap the check-and-move pattern in a repeat(10) loop
        5. The full solution: repeat 10 times { if is_alien_above() { shoot() } move() }

        Common mistakes:
        - Shooting without checking (hits empty columns and loses)
        - Forgetting the repeat loop (only checks one position)
        - Wrong repeat count (11 would move off the edge)
        - Putting move() inside the if block (only moves when there's an alien)
        - Using else when it's not needed (just skip shooting if no alien)

        Teaching strategy:
        - Ask: "What's different from the previous exercise?" (not every column has an alien)
        - Ask: "How can you check if there's an alien above before shooting?"
        - Guide them to the if pattern: if is_alien_above() do shoot() end
        - Then ask: "How do you do this for every column?"
        - Emphasize that move() must happen every time, not just when there's an alien
      `
    }
  }
};
