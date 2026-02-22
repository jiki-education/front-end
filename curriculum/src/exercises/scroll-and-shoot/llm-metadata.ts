import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This is a classic Space Invaders exercise that teaches students about state management,
    boundary checking, and game loops. Students need to move a laser cannon left and right,
    detect aliens, and shoot them down without missing or moving off-screen.

    Key concepts: position tracking, direction toggling, boundary detection, conditional shooting,
    and repeatUntilGameOver loops.

    This exercise has multiple valid solutions - there are many ways to structure the logic.
    Encourage students to break down the problem into smaller steps.
  `,

  tasks: {
    "scroll-and-shoot": {
      description: `
        Students need to:
        1. Track the laser's position (0-10)
        2. Track the direction (left or right)
        3. Check boundaries and reverse direction when hitting edges
        4. Check for aliens above before shooting
        5. Move the laser in the correct direction

        Common mistakes:
        - Not tracking position, causing them to go off-screen
        - Shooting without checking for aliens first
        - Not reversing direction at boundaries
        - Shooting too fast (need to move between shots to prevent overheating)

        Teaching strategy:
        - Encourage students to solve movement first, then add shooting logic
        - Suggest using variables for leftBoundary (0) and rightBoundary (10)
        - Remind them to use isAlienAbove() before calling shoot()
        - Point out that the logic is similar to the rainbow ball bouncing exercise
        - Help them understand repeatUntilGameOver will keep running until all aliens are destroyed
      `
    },

    "bonus-challenges": {
      description: `
        These bonus challenges test advanced control flow:

        1. No repeat: Students must use only repeatUntilGameOver, not repeat with a fixed count.
           This reinforces the game loop concept.

        2. One shoot(): Students can only write shoot() once in their code. This requires
           them to use conditional logic to control when shooting happens, rather than
           duplicating the shoot() call in multiple places.

        These challenges encourage cleaner, more elegant code structure. If students struggle,
        suggest they consolidate their logic into a single main game loop.
      `
    }
  }
};
