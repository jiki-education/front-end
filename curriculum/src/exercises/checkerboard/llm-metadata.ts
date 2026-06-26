import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    A capstone-style drawing project for the conditionals-and-state level. The student
    draws an 8x8 checkerboard and lays out draughts/checkers pieces on it. It combines
    nested loops, modulo, and layered conditionals, and rewards deriving positions from a
    single 'cell' size rather than hardcoding coordinates.
  `,

  tasks: {
    "set-up-the-board": {
      description: `
        One task: draw the board and place the pieces.

        Geometry: 8x8 board, 2-unit border, so cell = (100 - 2 * 2) / 8 = 12. Square
        (row, col) is at (2 + col * 12, 2 + row * 12), size 12x12.

        Board: a square is dark when (row + col) % 2 === 1 (charcoal), otherwise light
        (white). That one modulo test produces the whole alternating pattern.

        Pieces: pieces sit ONLY on dark squares, so the placement reuses the same
        (row + col) % 2 test. Red pieces on the top three rows (row <= 2), blue pieces on
        the bottom three rows (row >= 5). The middle two rows stay empty. Each piece is a
        circle centred in its square (offset by cell / 2) with radius cell / 2 - 1.

        Why it's a good project:
        - The modulo does double duty: the board pattern AND which squares get pieces.
        - It layers a relational check (row <= 2 / row >= 5) inside the modulo check.
        - Deriving every coordinate from 'cell' is the relational-thinking lesson, the
          same skill practised in structured-house.

        Common stumbling points: hardcoding the 12s instead of deriving cell; putting
        pieces on light squares; filling the middle rows; forgetting that the piece
        placement should reuse the dark-square test rather than colour every square.
      `
    }
  }
};
