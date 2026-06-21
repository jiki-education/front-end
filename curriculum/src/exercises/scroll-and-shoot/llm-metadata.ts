import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise lets a student explore position/direction state, boundary reversal, and conditional shooting inside a game loop. There are many valid structures; encourage breaking it into movement first, then shooting.
  `,

  tasks: {
    "scroll-and-shoot": {
      description: `
        Track position and direction, reverse at the edges, check isAlienAbove() before shooting, and move each tick.

        Common mistakes: not tracking position and going off-screen; calling shoot() without checking for an alien (wastes ammo, loses); not reversing at boundaries; shooting twice in a row without moving (overheats).

        Teaching strategy: get movement working before adding shooting. The bounce-at-edges logic mirrors the rainbow-ball-bouncing exercise.
      `
    },

    "bonus-challenges": {
      description: `
        Builds on the working solution under tighter constraints. "No repeat" forces the repeatUntilGameOver loop instead of a fixed count. "One shoot()" forces a single conditional shoot() call rather than duplicating it, pushing toward one consolidated game loop.
      `
    }
  }
};
