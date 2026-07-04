import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    Automate winning Space Invaders by scrolling the laser back and forth and shooting aliens. The core is the same bounce-at-the-edges pattern as the rainbow-ball exercise, but tracked with a position/direction pair rather than coordinates.
  `,

  tasks: {
    "scroll-and-shoot": {
      description: `
        One task graded across five waves of increasing density: one-alien, one-row, two-rows, three-rows, then full-rows. The same solution should clear them all, so the progression is about confidence, not new logic — get it working on one-alien first, then trust it scales.

        The final wave (full-rows) enables respawning aliens and enforces a code check: the loop must be a run-forever repeat() with no counted repeat(n), because the number of shots needed is unknowable. A student who solved earlier waves with a fixed repeat(30) will pass those but fail full-rows on the code check, not the game — point them at converting to repeat().

        Common mistakes: going off-screen (not reversing at the boundary); calling shoot() without an isAlienAbove() check (wastes ammo, instant loss); shooting twice without moving in between (the cannon overheats).
      `
    }
  }
};
