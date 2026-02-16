import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise introduces the circle function. Students complete a sunshine picture
    by drawing a yellow circle. The background sky and triangle sun spikes are already
    provided in the stub code.
    Key concepts: function calls with multiple arguments, the circle function, coordinates.
  `,

  tasks: {
    "draw-sun": {
      description: `
        Students must draw a yellow circle at the center of the canvas to complete the sun.

        Key teaching points:
        1. Circle parameters: (x, y, radius, color)
        2. x and y are the CENTER of the circle, not the top-left
        3. Coordinate system: (0,0) is top-left, (100,100) is bottom-right
        4. The center of the canvas is (50, 50)

        The stub already contains the sky background rectangle and 8 triangle spikes.
        Students only need to add: circle(50, 50, 25, "#ffed06")

        Common mistakes:
        - Using wrong coordinates (the center is 50, 50)
        - Forgetting the color argument
        - Confusing radius with diameter
      `
    }
  }
};
