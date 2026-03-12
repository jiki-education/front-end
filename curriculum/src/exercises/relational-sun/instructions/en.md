---
title: "Relational Sun"
description: ""
---

In this exercise, your task is to position a sun in the top-right corner of the sky using arithmetic and variables. The key constraint is that the edge of the sun should always be a fixed **gap** away from the edge.

### A Three-step Process

This exercise has three steps.

#### 1. Define your fact variables

Define variables for:

- `canvasSize`: The size of the canvas (which is `100`)
- `gap`: How far from the top-right edge the sun's edge should be.
- `radius`: The sun's radius.
- `color`: Set it to `"yellow"`.

You can work out the gap and radius by hovering over the area and measuring. They're both divisible by 5. If you can't work it out, check the hints.

#### 2. Define calculated variables

Define `sunX` and `sunY` variables that use the gap and radius and the size of the canvas to set the central point of the sun to the top right of the image.

To pass the exercise, `sunX` and `sunY` can't be set to any numbers - only calculations involving other variables.

#### 3. Draw the circle

Draw a circle using `sunX`, `sunY`, `radius` and `color`.

If you connect everything up correctly, you should be able to change radius and gap and rerun your code to see the sun get larger in the sky!
