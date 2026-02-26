---
title: "Relational Sun"
description: ""
---

Your task is to position a sun in the top-right corner of the sky using arithmetic and variables.

<!-- TODO: Add target relational sun image here -->

### How it works

- The top-left of the drawing canvas is `0,0`. The bottom-right is `100,100`.
- Several variables are fixed: `canvasSize`, `gap`, `sunRadius`, `skyColor`, and `sunColor`.
- You need to derive `sunX` and `sunY` so the sun sits in the top-right corner with a gap from the edges.
- The sun's center should be `gap + sunRadius` away from the top and right edges.
- You also need to draw the sky rectangle and the sun circle using the variables.

### Variables

- `canvasSize` — the width and height of the canvas (fixed at 100)
- `gap` — the space between the sun and the canvas edge (fixed at 10)
- `sunRadius` — the radius of the sun (fixed at 15)
- `skyColor` — the color of the sky (fixed at "skyblue")
- `sunColor` — the color of the sun (fixed at "yellow")
- `sunX` — derive from `canvasSize`, `gap`, and `sunRadius`
- `sunY` — derive from `gap` and `sunRadius`

### Functions used in this exercise

- `rectangle(x, y, width, height, color)` — Draw a rectangle
- `circle(x, y, radius, color)` — Draw a circle
