---
title: "Snowman"
description: ""
---

Your task is to build a snowman by setting the right variable values so your snowman matches the image.

<!-- TODO: Add target snowman image here -->

### How it works

- The top-left of the drawing canvas is `0,0`. The bottom-right is `100,100`.
- The code to draw the snowman is already written for you.
- You need to set the correct values for the **7 variables** at the top of the code.
- The snowman is made of three white circles (head, body, base) stacked on top of each other.
- The base is the biggest circle, the body is medium, and the head is the smallest.
- All three circles share the same `x` position (the snowman is centered).

### Variables to set

- `snowmanX` — the horizontal center of the snowman
- `headY`, `headRadius` — the vertical center and radius of the head
- `bodyY`, `bodyRadius` — the vertical center and radius of the body
- `baseY`, `baseRadius` — the vertical center and radius of the base

### Functions used in this exercise

- `rectangle(x, y, width, height, color)` — Draw a rectangle
- `circle(cx, cy, radius, color)` — Draw a circle
