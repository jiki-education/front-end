import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches animation through variable mutation in a loop.
    Students learn to use variables to track changing values (position, size, color)
    and update them each iteration to create smooth animations.
    Key concepts: variable initialization outside loops, variable updates inside loops,
    RGB and HSL color systems, layered drawing (draw order matters).
  `,

  tasks: {
    "draw-scene": {
      description: `
        Students must animate a sunset scene by:
        1. Initializing variables BEFORE the repeat loop
        2. Updating variables INSIDE the loop, BEFORE drawing shapes
        3. Drawing shapes in the correct order (sky first, then sun, then sea and sand)

        Animation requirements:
        - Sun radius: starts at 5, increases by 0.2 each iteration (ends at ~24.8)
        - Sun y-position: starts at 10, increases by 1 each iteration (ends at ~109)
        - Sun color: animate using RGB (rgb) - decrease green from 237 to make it more orange
        - Sky color: animate using HSL (hsl) - update hue to shift the color

        Key teaching points:
        1. Variables must be initialized OUTSIDE the loop
        2. Variables must be updated INSIDE the loop BEFORE drawing
        3. Draw order matters - later drawings cover earlier ones
        4. RGB: red 0-255, green 0-255, blue 0-255
        5. HSL: hue 0-360, saturation 0-100, luminosity 0-100

        Common mistakes:
        - Initializing variables inside the loop (resets them each iteration)
        - Updating variables after drawing (one frame behind)
        - Wrong draw order (sun hidden behind sky)
        - Confusion between RGB and HSL color systems
        - Forgetting that the scene redraws completely each frame

        Solution approach:
        1. Set sunRadius, sunCy, sunGreen (and optionally skyH) before the loop
        2. In each iteration: update variables first, then draw sky, sun, sea, sand
      `
    }
  }
};
