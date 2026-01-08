import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches spatial reasoning and symmetry in visual design.
    Students complete a penguin drawing by adding missing symmetrical elements.
    Key concepts: coordinate systems, symmetry, color management, shape composition.
  `,

  tasks: {
    "draw-penguin": {
      description: `
        Students must complete a half-drawn penguin by adding symmetrical counterparts.

        Key teaching points:
        1. Coordinate symmetry: For center at x=50, if left is at x=28, right is at x=72
        2. Color management: Must set fill_color_hex() before each shape
        3. Shape parameters: Understanding cx/cy for circles/ellipses vs x/y for rectangles
        4. Triangle modification: Change existing triangle coordinates (don't add new one)

        Common mistakes:
        - Forgetting to set fill color before drawing
        - Incorrect symmetry calculations (mirror across x=50 centerline)
        - Adding new triangle instead of modifying existing one
        - Wrong coordinate system (0,0 is top-left, not bottom-left)

        Solution approach:
        1. Identify each TODO comment in sequence
        2. Find the corresponding left-side element
        3. Calculate the mirrored x-coordinate (keep y the same)
        4. Set appropriate fill color
        5. Draw the symmetrical shape
        6. For the nose: modify the middle point of the existing triangle
      `
    }
  }
};
