import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise introduces the ellipse function while combining rectangle and circle.
    Students create a weather scene with sun, cloud, and rain drops, drawing on top of
    a faded template background image that shows the outlines.
    Key concepts: ellipse function (rx vs ry for oval shapes), combining multiple shape types,
    using a visual template to guide placement.
  `,

  tasks: {
    "draw-scene": {
      description: `
        Students build a weather scene using circles and ellipses on top of a template image.
        The cloud body rectangle is pre-provided in the stub code.

        Key teaching points:
        1. Ellipse parameters: (x, y, rx, ry, color) — rx and ry control width and height
        2. When rx < ry, the ellipse is taller than wide (like a rain drop)
        3. Combining previously learned shapes (rectangle, circle) with ellipse
        4. The sun should be drawn before the cloud so the cloud sits in front of it

        The scene components:
        - Sun: circle(75, 30, 15, "yellow")
        - Cloud body: rectangle(25, 50, 50, 10, "white") — given in stub
        - Cloud puffs: 4 white circles along the rectangle edges
        - Rain: 5 blue ellipses (rx=3, ry=5) below the cloud

        Common mistakes:
        - Confusing rx and ry in ellipse (rx is horizontal, ry is vertical)
        - Drawing the sun after the cloud (it should be behind the cloud)
        - Using ellipses for the cloud puffs instead of circles
      `
    }
  }
};
