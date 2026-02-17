import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches arithmetic with variables for positioning.
    Students derive a sun's position from canvas size, gap, and radius
    using subtraction and addition. Also practices using string variables for colors.
    Key concepts: arithmetic expressions with subtraction, relative positioning from edges.
  `,

  tasks: {
    "position-sun": {
      description: `
        Students derive sun position and draw the scene using variables.

        Fixed variables:
        - canvas_size = 100
        - gap = 10
        - sun_radius = 15
        - sky_color = "lightblue"
        - sun_color = "yellow"

        Derived variables:
        - sun_x = canvas_size - gap - sun_radius = 75
        - sun_y = gap + sun_radius = 25

        Expected drawing:
        - rectangle(0, 0, canvas_size, canvas_size, sky_color)
        - circle(sun_x, sun_y, sun_radius, sun_color)

        Key teaching points:
        1. Subtraction for positioning from the right edge
        2. Addition for positioning from the top edge
        3. Using string variables for colors (not just numbers)
        4. The gap ensures the sun doesn't touch the edge

        Common mistakes:
        - Forgetting to subtract the radius (sun would clip the edge)
        - Swapping the x and y formulas
        - Hardcoding 75 and 25 instead of using expressions
        - Forgetting to draw the sky rectangle
      `
    }
  }
};
