import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise introduces the triangle and circle functions. Students create a sunshine
    picture by drawing 8 yellow triangle spikes and a yellow circle. Only the blue sky
    background is provided in the stub code.
    Key concepts: function calls with multiple arguments, the triangle function (7 args),
    the circle function (4 args), coordinates.
  `,

  tasks: {
    "draw-sun": {
      description: `
        Students must draw 8 yellow triangle spikes and a yellow circle to create a sunshine picture.

        Key teaching points:
        1. Triangle parameters: (x1, y1, x2, y2, x3, y3, color) — three corner points and a color
        2. Circle parameters: (x, y, radius, color)
        3. x and y for circle are the CENTER of the circle, not the top-left
        4. Coordinate system: (0,0) is top-left, (100,100) is bottom-right
        5. The center of the canvas is (50, 50)

        The stub only contains the sky background rectangle.
        Students need to add all 8 triangle spikes and the circle.

        The 8 spikes (in order: top-left, top, top-right, right, bottom-right, bottom-left, bottom, left):
        - triangle(10, 10, 29, 33, 33, 29, "#ffed06")
        - triangle(50, 2, 47, 23, 53, 23, "#ffed06")
        - triangle(90, 10, 71, 33, 67, 29, "#ffed06")
        - triangle(98, 50, 77, 47, 77, 53, "#ffed06")
        - triangle(90, 90, 71, 67, 67, 71, "#ffed06")
        - triangle(10, 90, 29, 67, 33, 71, "#ffed06")
        - triangle(50, 98, 47, 77, 53, 77, "#ffed06")
        - triangle(2, 50, 23, 47, 23, 53, "#ffed06")

        The sun: circle(50, 50, 25, "#ffed06")

        Common mistakes:
        - Mixing up the order of triangle coordinates
        - Using wrong coordinates for the circle center (should be 50, 50)
        - Forgetting the color argument
        - Confusing radius with diameter
      `
    }
  }
};
