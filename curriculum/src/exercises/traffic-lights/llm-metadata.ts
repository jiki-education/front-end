import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise reinforces using variables as function arguments.
    Variables are already declared — students must use them when calling
    the circle function to draw three traffic lights.
    Key concepts: reading variable values, passing variables to functions.
  `,

  tasks: {
    "draw-lights": {
      description: `
        Students must draw 3 circles using the provided variables.

        The variables (already set):
        - radius = 10
        - center_x = 50
        - top_y = 25, middle_y = 50, bottom_y = 75

        Expected calls:
        - circle(center_x, top_y, radius, "#FF0000")
        - circle(center_x, middle_y, radius, "#FFFF00")
        - circle(center_x, bottom_y, radius, "#00FF00")

        Key teaching points:
        1. Variables can be used as arguments to functions
        2. The same variable (center_x, radius) can be reused across multiple calls
        3. Students read existing variable declarations and use them

        Common mistakes:
        - Using literal numbers instead of variables
        - Mixing up the y positions for the colors
        - Forgetting the color argument
      `
    }
  }
};
