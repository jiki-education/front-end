import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise introduces the ellipse function while combining rectangle and circle.
    Students create a weather scene with sky, sun, cloud, and rain drops.
    Key concepts: ellipse function (rx vs ry for oval shapes), combining multiple shape types, layering.
  `,

  tasks: {
    "draw-scene": {
      description: `
        Students build a weather scene using rectangles, circles, and ellipses.

        Key teaching points:
        1. Ellipse parameters: (x, y, rx, ry, color) — rx and ry control width and height
        2. When rx < ry, the ellipse is taller than wide (like a rain drop)
        3. Combining previously learned shapes (rectangle, circle) with ellipse
        4. Drawing order matters for layering

        The scene components:
        - Background: rectangle(0, 0, 100, 100, "#ADD8E6")
        - Sun: circle(75, 30, 15, "#ffed06")
        - Cloud body: rectangle(25, 50, 50, 10, "#FFFFFF") — given in stub
        - Cloud puffs: 4 white circles along the rectangle edges
        - Rain: 5 blue ellipses (rx=3, ry=5) below the cloud

        Common mistakes:
        - Confusing rx and ry in ellipse (rx is horizontal, ry is vertical)
        - Forgetting the background so shapes appear on white
        - Wrong layering order (background must be first)
      `
    }
  }
};
