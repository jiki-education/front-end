import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches arithmetic with variables. Students derive snowman
    dimensions from headRadius and groundY using multiplication and subtraction.
    Key concepts: arithmetic expressions, variable relationships, relative positioning.
  `,

  tasks: {
    "build-relational-snowman": {
      description: `
        Students derive all sizes and positions from fixed variables using arithmetic.
        The snowman sits on the ground and expands upward.

        Fixed variables:
        - headRadius = 5
        - snowmanX = 50
        - groundY = 80

        Derived variables:
        - bodyRadius = headRadius * 2 = 10
        - baseRadius = headRadius * 3 = 15
        - baseY = groundY - baseRadius = 65
        - bodyY = baseY - baseRadius - bodyRadius = 40
        - headY = bodyY - bodyRadius - headRadius = 25

        Key teaching points:
        1. Variables can be defined in terms of other variables
        2. Multiplication for scaling (headRadius * 2, headRadius * 3)
        3. Subtraction for upward positioning from a ground line
        4. Circles touch when distance between centers = sum of radii
        5. Changing headRadius scales the entire snowman proportionally

        Common mistakes:
        - Hardcoding numbers instead of using expressions
        - Forgetting that circles touch at the sum of their radii
        - Using diameter instead of radius for positioning
        - Getting the subtraction order wrong (building upward from ground)
      `
    }
  }
};
