import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise lets a student explore if-statements in a Space Invaders context. They already know repeat loops; the new idea is conditionally shooting based on isAlienAbove(), since not every column has an alien. Five alien layouts prevent hard-coding shoot positions.
  `,

  tasks: {
    "conditional-shoot": {
      description: `
        Loop across all columns, checking isAlienAbove() before shooting and moving every iteration regardless.

        Common mistakes:
        - Shooting without checking (hits an empty column and loses)
        - Putting move() inside the if, so it only moves when there's an alien
        - Wrong repeat count (too many moves off the edge)

        Teaching strategy: ask what's different from the previous exercise (not every column has an alien), then guide them to the if-then-shoot pattern, then to applying it across every column with move() always running.
      `
    }
  }
};
