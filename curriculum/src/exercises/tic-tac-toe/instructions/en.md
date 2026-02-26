---
title: "Tic Tac Toe"
description: ""
---

Welcome to Tic Tac Toe - your first major project!

This exercise brings together everything you've learnt so far: variables, functions, conditionals, looping, lists, and different data types. You're going to write well over 100 lines of code and build something from scratch.

This is more involved than the exercises you've solved already. Take your time, think through the problems carefully, and don't be afraid to reach out for help.

## Game Rules

In Tic Tac Toe, one player is `o` and one player is `x`, and you take turns to write your symbol in one of the squares of a 3x3 grid.

If you place three of your symbols in a row (horizontally, vertically, or diagonally) then you win! If all spaces get taken without three in a row, the game is a draw.

## Instructions

Create a `runGame(moves)` function.

It takes one argument `moves`, which is a list of coordinate pairs (e.g. `[[1,2], [3,2]]` means the first player places a piece in column 2 of row 1, then the next player places in column 2 of row 3).

The function should create a game board, then place each piece from the moves list. As it does so, it should check whether each move is valid, and announce a winner if appropriate.

Sometimes a move might be a `"?"` instead of a coordinate pair. In these situations, your code decides what move to play:

- If you can win, win.
- If you can block your opponent's win, do so.
- Otherwise place a piece wherever is sensible.

### The Board

Draw a board made up of:

1. A rectangle from (5,5) with width 90 and height 90: `rectangle(5, 5, 90, 90, "#ffffff")`
2. Grid lines dividing the board equally into 9 squares.

Use `changeStroke(1, "#333333")` to set a stroke width of 1 and a color of your choice.

### Pieces

Draw pieces as circles and crosses (two lines each):

- All pieces are placed in the center of their squares.
- Circles have a radius of 10.
- Crosses are two lines spanning 20 in both directions.

### Making Moves

- The first move should always be an `o`.
- Moves alternate between `o` and `x`.
- If a player makes an invalid move (placing on an occupied square), write `"Invalid move!"` with a red overlay (`rectangle(0, 0, 100, 100, "#c80000")`) and stop processing moves.

### Draws

If the board fills without a winner:

- Turn all pieces to light grey using `changeStroke` with a grey color.
- Draw a purple overlay: `rectangle(0, 0, 100, 100, "#604fcd")`
- Write `"The game was a draw!"`

### Winning

If either player gets 3 in a row:

- Redraw the winning row in `"#604fcd"`.
- Turn all other pieces to light grey.
- Draw a purple overlay: `rectangle(0, 0, 100, 100, "#604fcd")`
- Write either `"The x's won!"` or `"The o's won!"`

### Incomplete Games

Some scenarios have incomplete games. In those situations, do not show a results screen. Leave the game in the state where another move could be made.

### Play in Order

The scenarios expect you to play the game out in order. Make each move on the board, then deal with the final state at the end.
