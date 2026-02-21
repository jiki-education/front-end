import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches combining conditionals with state management inside a loop.
    Students create a bouncing ball that leaves a rainbow trail by updating position
    and color variables each iteration, checking boundary conditions with if statements,
    and using random numbers to set new directions. Key concepts: variable mutation
    inside loops, conditional boundary checking, combining multiple state variables,
    and using functions that return values (random_number, hsl).
  `,

  tasks: {
    "rainbow-ball": {
      description: `
        Students must create a bouncing ball that trails rainbow-colored circles.

        Key requirements:
        - 1000 circles using a repeat loop
        - Position variables (x, y) updated each iteration by direction variables
        - Direction reverses with random speed when ball hits canvas edges (0 or 100)
        - Hue variable cycles between 0 and 360, reversing direction at boundaries
        - Each circle drawn with hsl color

        Key teaching points:
        1. Combining conditionals with state: checking boundaries and updating variables
        2. Multiple state variables working together (position, direction, color)
        3. Using randomNumber() return values to set new directions
        4. Composing functions: hsl() output used as circle() input

        Common mistakes:
        - Checking hueDirection instead of hue for the color boundary conditions
        - Forgetting to use randomNumber() for new directions (using fixed values)
        - Using the wrong sign for directions (positive when should be negative)
        - Not updating x/y/hue before the boundary checks
        - Using hsl with hue values outside 0-360 range
      `
    }
  }
};
