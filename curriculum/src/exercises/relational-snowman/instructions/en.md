---
title: "Relational Snowman"
description: ""
---

Your task is to rewrite the snowman so all the sizes and positions are derived from a single `size` variable using arithmetic.

<!-- TODO: Add target relational snowman image here -->

### How it works

- The top-left of the drawing canvas is `0,0`. The bottom-right is `100,100`.
- Three variables are fixed: `size`, `snowmanX`, and `headY`.
- You need to derive all other variables using arithmetic expressions.
- The head radius is `size * 2`, the body radius is `size * 3`, and the base radius is `size * 4`.
- The circles should touch each other: the body sits directly below the head, and the base sits directly below the body.
- To make two circles touch, the distance between their centers equals the sum of their radii.

### Variables

- `size` — the base unit (fixed at 5)
- `snowmanX` — horizontal center (fixed at 50)
- `headY` — vertical center of the head (fixed at 20)
- `headRadius` — derive from `size`
- `bodyRadius` — derive from `size`
- `baseRadius` — derive from `size`
- `bodyY` — derive from `headY`, `headRadius`, and `bodyRadius`
- `baseY` — derive from `bodyY`, `bodyRadius`, and `baseRadius`

### Functions used in this exercise

- `rectangle(x, y, width, height, color)` — Draw a rectangle
- `circle(x, y, radius, color)` — Draw a circle
