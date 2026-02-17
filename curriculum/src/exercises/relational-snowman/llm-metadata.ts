import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches arithmetic with variables. Students derive snowman
    dimensions from head_radius and ground_y using multiplication and subtraction.
    Key concepts: arithmetic expressions, variable relationships, relative positioning.
  `,

  tasks: {
    "build-relational-snowman": {
      description: `
        Students derive all sizes and positions from fixed variables using arithmetic.
        The snowman sits on the ground and expands upward.

        Fixed variables:
        - head_radius = 5
        - snowman_x = 50
        - ground_y = 80

        Derived variables:
        - body_radius = head_radius * 2 = 10
        - base_radius = head_radius * 3 = 15
        - base_y = ground_y - base_radius = 65
        - body_y = base_y - base_radius - body_radius = 40
        - head_y = body_y - body_radius - head_radius = 25

        Key teaching points:
        1. Variables can be defined in terms of other variables
        2. Multiplication for scaling (head_radius * 2, head_radius * 3)
        3. Subtraction for upward positioning from a ground line
        4. Circles touch when distance between centers = sum of radii
        5. Changing head_radius scales the entire snowman proportionally

        Common mistakes:
        - Hardcoding numbers instead of using expressions
        - Forgetting that circles touch at the sum of their radii
        - Using diameter instead of radius for positioning
        - Getting the subtraction order wrong (building upward from ground)
      `
    }
  }
};
