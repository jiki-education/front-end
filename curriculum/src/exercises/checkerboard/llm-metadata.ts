import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    A drawing project built up in layers. There is a single scenario, but the work has a natural
    order - always help the student with the NEXT piece they're stuck on, not the whole thing at
    once. Work out from their code and canvas how far they've got, then nudge them to the next step:

    1. Get the board size from getBoardSize() and derive ONE cell size from it (canvas minus border,
       divided by the board size). Everything else is built from this - nothing hardcoded.
    2. Draw the border around the edge.
    3. Draw the grid of squares with nested loops (rows x columns), each positioned from the cell size.
    4. Colour the squares so they alternate (dark and light).
    5. Put pieces on the dark squares only.
    6. Restrict the pieces to the top and bottom rows, leaving the middle two rows empty.
    7. Give each end its own colour and make each piece ridged (a rim circle plus a smaller centre
       circle), centred in its square.

    Diagnosing common sticking points:
    - Squares in the wrong place or overlapping -> position/cell-size arithmetic (step 1/3).
    - Whole board one colour or a stripe pattern -> the alternate-colour test (step 4).
    - Pieces on every square, or on the light ones -> the dark-square test isn't being reused (step 5).
    - Pieces filling the whole board -> the top/bottom-rows-only restriction is missing (step 6).
    - Works on 8x8 but not 6x6 or 10x10 -> a hardcoded size, row number, or coordinate that only
      happens to be right for 8. The three sizes exist specifically to catch this.

    Testing details the student can't see (so you can reassure them):
    - The border can be one filled square behind the board OR four frame rectangles - both pass.
    - Pieces are matched by centre + colour, not radius, so any sensible piece size is fine.
  `,

  tasks: {
    "set-up-the-board": {
      description: `
        One scenario covering the whole board (border, squares, pieces), run at three sizes. Use the
        numbered steps above to locate where the student is and help them with the next one only.
      `
    }
  }
};
