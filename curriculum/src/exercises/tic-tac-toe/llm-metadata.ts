import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This is a major project exercise that brings together lists, conditionals, loops, functions, and drawing.
    Students build a complete Tic Tac Toe game from scratch, including board drawing, piece placement,
    win/draw detection, invalid move handling, and basic AI. It is the most complex exercise at the lists level.
  `,

  tasks: {
    "play-tic-tac-toe": {
      description: `
        Students must create a runGame(moves) function that:
        1. Draws a 3x3 grid using rectangle() and line()
        2. Places pieces (circles for o, crosses for x) using circle() and line()
        3. Tracks board state using a 2D list
        4. Detects wins by checking 8 possible lines (3 rows, 3 cols, 2 diags)
        5. Handles draws when all 9 squares are filled
        6. Detects invalid moves (placing on occupied squares)
        7. Implements basic AI for "?" moves (win > block > any open)
        8. Uses changeStroke() to grey out pieces and highlight winners
        9. Draws overlay rectangles and writes result messages

        Common mistakes:
        - Forgetting that the first move is always "o" (the turn starts at "x" and switches before each move)
        - Not checking for wins after EACH move
        - Using wrong coordinates for piece centers (should be at 20, 50, 80 for cols/rows 1, 2, 3)
        - Not greying out all pieces before highlighting the winning line
        - Drawing the overlay or writing messages for incomplete games
        - Forgetting to handle the "?" AI moves

        Encourage students to:
        - Break the problem into small helper functions
        - Test with the partial-game scenario first before tackling wins/draws
        - Use a list of permutations (winning lines) to check for wins efficiently
      `
    }
  }
};
