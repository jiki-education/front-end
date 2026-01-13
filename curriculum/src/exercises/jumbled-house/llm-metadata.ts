import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches coordinate system understanding and precise positioning in visual design.
    Students rearrange misplaced house shapes to their correct positions through careful calculation.
    Key concepts: coordinate systems, shape positioning, methodical problem-solving, spatial reasoning.
  `,

  tasks: {
    "arrange-house": {
      description: `
        Students must reposition all house elements to their correct coordinates.

        Key teaching points:
        1. Coordinate system: (0,0) is top-left, (100,100) is bottom-right
        2. Rectangle positioning: x,y is top-left corner, then width and height
        3. Triangle positioning: three points define the vertices
        4. Circle positioning: x,y is center, then radius

        Shape specifications:
        - House frame: position (20,50), size 60x40
        - Roof: triangle at (16,50), (50,30), (84,50) - overhangs house by 4 each side
        - Left window: position (30,55), size 12x13 - 10 in from left (20+10), 5 down from top (50+5)
        - Right window: position (58,55), size 12x13 - 10 in from right (80-12-10=58)
        - Door: position (43,72), size 14x18 - centered (20 + (60-14)/2 = 43)
        - Door knob: center (55,81), radius 1 - inset 1 from right of door, vertically centered

        Common mistakes:
        - Confusing x,y as center vs top-left corner for rectangles
        - Not accounting for shape dimensions when calculating positions
        - Forgetting that y increases downward (not upward like math coordinates)
        - Incorrect overhang calculation for the roof

        Solution approach:
        1. Work through shapes in order (sky, grass, frame, roof, windows, door, knob)
        2. For each shape, read the specification carefully
        3. Calculate exact coordinates step by step
        4. Verify by checking if the numbers make geometric sense
      `
    }
  }
};
