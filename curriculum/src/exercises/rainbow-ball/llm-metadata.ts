import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches animation with bouncing and randomness.
    Students learn to use velocity variables that change direction on collision,
    and how to use random numbers for unpredictable behavior.
    Key concepts: velocity, direction changes, conditionals, random numbers, canvas coverage.
  `,

  tasks: {
    "animate-ball": {
      description: `
        Students must animate a ball that bounces around and paints a rainbow.

        Key requirements:
        - First circle at (5, 5) with radius 10
        - Ball moves 2 right and 1 down initially
        - Ball bounces off edges with random new direction
        - Hue cycles from 100 up to 255, then back down
        - Must paint 80% of canvas with 255+ unique colors

        Key teaching points:
        1. Use velocity variables (x_direction, y_direction) instead of hard-coded values
        2. Check boundaries and change velocity sign when hitting edges
        3. Use random_number(min, max) for unpredictable bouncing
        4. Initialize variables so first drawing is at correct position
        5. Need ~1000 iterations to cover 80% of canvas

        Common mistakes:
        - Forgetting initial offsets (x=3, y=4 so first draw is at 5, 6)
        - Not reversing direction correctly (use negative values or multiply by -1)
        - Hue cycling logic wrong (check hue_direction, not hue itself)
        - Too few iterations to cover canvas

        Solution pattern:
        - Track x, y position and x_direction, y_direction velocity
        - Each iteration: update position, check boundaries, update color, draw
        - On boundary hit: randomize the velocity in opposite direction
      `
    }
  }
};
