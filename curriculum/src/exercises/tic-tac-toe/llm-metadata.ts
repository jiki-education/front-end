import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This is the major capstone project of the lists level, bringing together lists,
    conditionals, loops, functions and drawing in a complete Tic Tac Toe game.
  `,

  tasks: {
    "play-tic-tac-toe": {
      description: `
        Non-obvious points:
        - The first move is always "o": track turn starting at "x" and switch BEFORE each move.
        - Check for a win after EVERY move, not just at the end.
        - Piece centers sit at 20, 50, 80 for cols/rows 1, 2, 3.
        - The "?" AI uses a strict priority: win if you can, else block the opponent's win,
          else play any open square.
        - There are 8 winning lines (3 rows, 3 cols, 2 diagonals); a list of these
          permutations makes win detection clean.

        Common mistakes:
        - Greying out pieces only partially before highlighting the winning line
        - Drawing the overlay or writing a message for an incomplete game

        Encourage breaking the problem into small helper functions and getting the
        partial-game scenario working before tackling wins/draws/AI.
      `
    }
  }
};
