import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This is a basic Space Invaders exercise that introduces students to calling functions
    in sequence. Students have only two functions: move() and shoot(). They need to look
    at the alien layout and write the correct sequence of calls to destroy all aliens.

    No variables, loops, or conditionals are needed - just sequential function calls.
    This is typically the student's first encounter with the Space Invaders game.
  `,

  tasks: {
    "shoot-the-aliens": {
      description: `
        Students need to:
        1. Look at the alien positions on screen (columns 1, 3, 6, 9)
        2. Write move() calls to reach each alien column
        3. Write shoot() at each alien column

        Common mistakes:
        - Miscounting the number of move() calls between aliens
        - Shooting when not directly below an alien (causes a loss)
        - Moving too far right off the edge (causes a loss)
        - Forgetting that they start at position 0

        Teaching strategy:
        - Encourage students to count positions carefully
        - Suggest writing comments to track their position
        - Remind them the laser starts at position 0 on the far left
        - If they're stuck, ask them to describe what they see on screen
      `
    }
  }
};
