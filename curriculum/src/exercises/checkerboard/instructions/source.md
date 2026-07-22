---
title: "Checkerboard"
description: "Draw a checkerboard of any size and set it up for a game, deriving every position from the board size."
---

In this project you'll draw a checkerboard and set up the pieces on it, ready for a game of draughts (also known as checkers).

Your code needs to work for **any board size**. We've given you three sample boards to try. One puzzle uses the classic 8x8 board, another a smaller 6x6, another a larger 10x10. You can use `getBoardSize()` to find out how many squares wide and tall the board is this time (the boards are always square).

<div style="display: flex; gap: 8px; margin: 12px 0;">
  <img src="/static/images/exercise-assets/checkerboard/board-6.svg" alt="6x6 checkerboard" style="width: 33.333%; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);" />
  <img src="/static/images/exercise-assets/checkerboard/board-8.svg" alt="8x8 checkerboard" style="width: 33.333%; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);" />
  <img src="/static/images/exercise-assets/checkerboard/board-10.svg" alt="10x10 checkerboard" style="width: 33.333%; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);" />
</div>

### The Board

As normal, the canvas is always `100` wide and `100` tall. Follow these two rules:

- The board has a `"black"` border around the edge that has a width of `2`.
- The squares should alternate between `"dark brown"` and `"white"`, sharing the space inside the border neatly. The bottom-left square is always dark brown, not white.

### The pieces

- Each piece lives in the center of a square.
- The pieces are ridged circles, with an outer border and an inner color:
  - The full piece is 80% as wide as the square.
  - The inner circle is 75% as wide as the full piece.
- The rows at the **top** of the board get `"charcoal"` pieces (each with a `"black"` rim).
- The rows at the **bottom** get `"white"` pieces (each with a `"grey"` rim).
- Pieces only ever sit on the **dark** squares.
- The **middle two rows** are always left empty. All the other rows have pieces on.

## Think relationally

The heart of this exercise is to **never hardcode** the sizes and positions. Work out a single "cell" size from the board size, then build every square and every piece from it. Get it right and the exact same code will draw a small 6x6 board and a larger 10x10 one without changing a single number.
