---
title: "Relational Sun"
description: "Position a sun where everything's calculated from variables."
---

In this exercise, your task is to position a sun in the top-right corner of the sky using arithmetic and variables. The key constraint is that the edge of the sun should always be a fixed **gap** away from the edge of the canvas, no matter what size the sun is.

We've preset two variables for you at the top of the file:

- `gap`: how far the sun's edge sits from the top and right edges of the canvas.
- `radius`: the sun's radius.

You can change these values to experiment — the sun should stay tucked into the top-right corner no matter what you pick.

### A Three-step Process

This exercise has three steps.

#### 1. Define your other fact variables

Define variables for:

- `canvasSize`: the size of the canvas, which is `100`.
- `color`: set it to `"yellow"`.

#### 2. Define calculated variables

Define `sunX` and `sunY` variables that use `gap`, `radius`, and `canvasSize` to set the centre of the sun in the top-right corner.

To pass the exercise, `sunX` and `sunY` can't be set to plain numbers — only calculations involving other variables.

#### 3. Draw the circle

Draw a circle using `sunX`, `sunY`, `radius`, and `color`.

If you connect everything up correctly, you can change `gap` and `radius` at the top of the file and rerun your code to see the sun grow or shift while staying in the corner.
