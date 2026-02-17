import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches arithmetic with variables. Students derive snowman
    dimensions from a single base variable using multiplication and addition.
    Key concepts: arithmetic expressions, variable relationships, relative positioning.
  `,

  tasks: {
    "build-relational-snowman": {
      description: `
        Students derive all sizes and positions from fixed variables using arithmetic.

        Fixed variables:
        - size = 5
        - snowman_x = 50
        - head_y = 20

        Derived variables:
        - head_radius = size * 2 = 10
        - body_radius = size * 3 = 15
        - base_radius = size * 4 = 20
        - body_y = head_y + head_radius + body_radius = 45
        - base_y = body_y + body_radius + base_radius = 80

        Key teaching points:
        1. Variables can be defined in terms of other variables
        2. Multiplication for scaling (size * 2, size * 3, size * 4)
        3. Addition for positioning (circles touch when distance = sum of radii)
        4. Changing size would scale the entire snowman proportionally

        Common mistakes:
        - Hardcoding numbers instead of using expressions
        - Forgetting that circles touch at the sum of their radii
        - Using diameter instead of radius for positioning
        - Getting the order wrong (body_y depends on head_radius and body_radius)
      `
    }
  }
};
