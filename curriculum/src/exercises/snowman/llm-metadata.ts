import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise introduces variables by having students set values to draw a snowman.
    The drawing code is already provided — students only need to figure out the correct
    variable values (positions and sizes) to match the target image.
    Key concepts: variable declaration, assigning number values, using variables as function arguments.
  `,

  tasks: {
    "build-snowman": {
      description: `
        Students must set 7 variables to correct values so the snowman matches the target image.

        The variables:
        - snowman_x = 50 (centered horizontally)
        - head_y = 33, head_radius = 10 (smallest, top)
        - body_y = 50, body_radius = 15 (medium, middle)
        - base_y = 72, base_radius = 20 (largest, bottom)

        Key teaching points:
        1. Variables store values that can be reused (snowman_x used in all 3 circles)
        2. Variable names should be descriptive
        3. The y-axis increases downward (0 at top, 100 at bottom)
        4. Students learn to visually estimate coordinates from the target image

        Common mistakes:
        - Mixing up y values (forgetting y increases downward)
        - Making the head bigger than the body or base
        - Getting the x position wrong (should be centered at 50)
        - Confusing radius with diameter
      `
    }
  }
};
