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

[TRIANGLE IMAGE]

### Drawing a fox face

Your job is to build a geometric fox face using triangles! The face should look like this:

<img src="/static/images/exercise-assets/foxy-face/example.svg" alt="Foxy Face" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

It's horizontally symmetrical (the left side is identical to the right side). And it has 8 triangles in total:

- Two `"white"` cheeks
- Two `"brown"` ears
- Two `"orange"` face halves
- A `"charcoal"` nose (two triangles)

Make sure to use those colors when drawing the triangles, and remember to check you write them as strings.

All the numbers used are divisible by 5 (e.g. `5`, `10`, `15`, etc are valid but `1`, `2`, `3`, `4`, `6`, `7`, `8`, `9`, `11`, etc are not).

We've drawn outlines of some of the parts for you to help you get started. If you follow the order given in the comments you'll find it makes life a little easier.

One final thing. You can hover over the space to find co-ordinates. That's great for the left side, but as the right side is symmetrical - can you solve that without needing to hover?

Good luck!
