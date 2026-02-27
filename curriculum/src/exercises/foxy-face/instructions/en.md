---
title: "Foxy Face"
description: ""
---

This exercise introduces you to the `triangle` function, which we use with 7 inputs:

- `x1`, `y1`: The first corner point
- `x2`, `y2`: The second corner point
- `x3`, `y3`: The third corner point
- `color`: The color of the triangle (e.g. `"orange"`)

Each pair of coordinates defines one of the three corners of the triangle.

### Drawing a fox face

Your job is to build a geometric fox face using triangles! The face should look like this:

<img src="/static/images/exercise-assets/foxy-face/example.svg" style="width: 100%; max-width:400px;margin-top:10px;margin-bottom:20px;border:1px solid #ddd;border-radius:5px"/>

It's horizontally symetrical (the left side is identical to the right side). And it has 8 triangles in total:

- Two `"white"` cheeks
- Two `"brown"` ears
- Two `"orange"` face halves
- A `"charcoal"` nose (two triangles)

All the numbers used are divisible by 5 (e.g. `5`, `10`, `15`, etc are valid but `1`, `2`, `3`, `4`, `6`, `7`, `8`, `9`, `11`, etc are not).

We've drawn outlines of some of the parts for you, and given you the real code for the top of the nose as an example. Your job is to draw the rest!

Hint: Build the fox from left to right, then top to bottom. Start with the left ear, left face, left cheek, then move onto the right ear, right face, right cheek. And finally the nose top and nose bottom.
