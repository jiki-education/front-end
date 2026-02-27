---
title: "Penguin"
description: ""
---

Your task is to make the penguin symmetrical.

It should look like this:

![Penguin](https://assets.exercism.org/bootcamp/graphics/penguin-finished.png)

The top-left of the drawing canvas is `0,0`. The bottom-right is `100,100`. The penguin is sitting in the middle.

We've drawn the left hand side for you, and added `TODO` comments for each of the things you need to do.

Each shape function takes a color as its last argument. The colors used are `"skyblue"`, `"white"`, `"black"`, and `"orange"`.

For the nose, you should **change** the middle coordinates of the triangle. Don't add a new triangle.

The functions used in this exercise are:

- `circle(centerX, centerY, radius, color)`
- `rectangle(x, y, width, height, color)`
- `ellipse(centerX, centerY, radiusX, radiusY, color)`
- `triangle(x1,y1, x2,y2, x3,y3, color)`
