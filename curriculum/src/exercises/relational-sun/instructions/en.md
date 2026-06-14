---
title: "Relational Sun"
description: "Position a sun where everything's calculated from variables."
---

In this exercise, your task is to position a sun in the top-right corner of the sky using arithmetic and variables. The key constraint is that the edge of the sun should always be a fixed **gap** away from the edge of the canvas, no matter what size the sun is.

We've preset four variables for you at the top of the file:

- `canvasSize`: the size of the canvas, which is `100`.
- `color`: set it to `"yellow"`.
- `gap`: how far the sun's edge sits from the top and right edges of the canvas.
- `radius`: the sun's radius.

### A two-step Process

To solve this exercise, do two things

#### 1. Define derived variables

Define `sunX` and `sunY` variables that use `gap`, `radius`, and `canvasSize` to set the centre of the sun in the top-right corner.

#### 2. Draw the circle

Draw a circle using `sunX`, `sunY`, `radius`, and `color`.

## Flexibility

If your code is correct, you will see the circle appear in the correct place on the page. However, to pass the exercise you can't just "hard-code" the value (meaning set it to a single number), `sunX` and `sunY` must be calculations involving other variables.

Once you've passed the exercise, click "Tidy my code" and try changing the values for `gap` and `radius` at the top of the file, and rerun your code to see the sun grow or shift while staying in the corner.

When you're done, you can hit "Dashboard" at the top right to continue on as normal.
