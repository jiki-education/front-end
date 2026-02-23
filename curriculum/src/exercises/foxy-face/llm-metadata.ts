import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches the triangle function by building a geometric fox face.
    Students learn to position triangles using three corner points (x1,y1), (x2,y2), (x3,y3).
    Key concepts: triangle function with 7 arguments, layering shapes, hex colors.
  `,

  tasks: {
    "draw-fox": {
      description: `
        Students must draw 8 triangles to create a geometric fox face on a grey background.

        Key teaching points:
        1. Triangle parameters: (x1, y1, x2, y2, x3, y3, color)
        2. Each pair of x,y defines one corner of the triangle
        3. Drawing order matters - shapes drawn later appear on top
        4. Using different shades of orange for depth

        The fox is built from these layers (back to front):
        - White cheeks: two triangles at the sides
        - Orange ears: two triangles pointing up
        - Orange face: two triangles forming the main face shape
        - Dark nose: two small triangles at the bottom center

        Common mistakes:
        - Wrong argument order (must be x1,y1,x2,y2,x3,y3,color)
        - Drawing in wrong order so shapes overlap incorrectly
        - Mixing up the different orange shades
      `
    }
  }
};
