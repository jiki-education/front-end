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

        The variables (already set, readonly):
        - radius = 8
        - centerX = 50
        - topY = 16, middleY = 39, bottomY = 62

        Expected calls:
        - circle(centerX, topY, radius, "red")
        - circle(centerX, middleY, radius, "amber")
        - circle(centerX, bottomY, radius, "green")

        Key teaching points:
        1. Variables can be used as arguments to functions
        2. The same variable (centerX, radius) can be reused across multiple calls
        3. Students read existing variable declarations and use them

        Common mistakes:
        - Using literal numbers instead of variables
        - Mixing up the y positions for the colors
        - Forgetting the color argument
      `
    }
  }
};
