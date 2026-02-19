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
        - canvasSize = 100
        - gap = 10
        - sunRadius = 15
        - skyColor = "lightblue"
        - sunColor = "yellow"

        Derived variables:
        - sunX = canvasSize - gap - sunRadius = 75
        - sunY = gap + sunRadius = 25

        Expected drawing:
        - rectangle(0, 0, canvasSize, canvasSize, skyColor)
        - circle(sunX, sunY, sunRadius, sunColor)

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
