---
title: "Checkerboard"
description: "Draw a checkerboard with nested loops and modulo, then lay out the pieces ready to play."
---

In this project you'll draw a full **8x8 checkerboard** and set up the pieces on it, ready for a game of draughts.

The canvas is `100` wide and `100` tall. Leave a **2-unit border** all the way around, so the board itself fills the space from `2` to `98`. That gives each of the 8 squares a width and height of `12`.

## Step 1: Draw the board

Use **nested loops** with a `row` and a `col` counter to walk over all 64 squares. The square at `(row, col)` has:

- its left edge at `2 + col * 12`
- its top edge at `2 + row * 12`
- a width and height of `12`

Colour each square so the board alternates. A square is **dark** (`charcoal`) when `(row + col)` is odd, and **light** (`white`) otherwise. The remainder operator makes this easy: `(row + col) % 2 === 1` is true for the dark squares.

## Step 2: Lay out the pieces

In draughts, the pieces only sit on the **dark** squares, so you can reuse the same `(row + col) % 2` test you used for the board.

- The **top three rows** (`row` 0, 1 and 2) get **red** pieces.
- The **bottom three rows** (`row` 5, 6 and 7) get **blue** (`skyblue`) pieces.
- The middle two rows stay empty.

Draw each piece as a `circle` centred in its square: `2 + col * 12 + 6` across, `2 + row * 12 + 6` down, with a radius of `5`.

## Think relationally

Don't hardcode the `12`s and `6`s everywhere. Work out a `cell` size once (`cell = (100 - 2 * 2) / 8`) and build every position from it. If you do it well, your code reads like the rules above rather than a list of magic numbers.
