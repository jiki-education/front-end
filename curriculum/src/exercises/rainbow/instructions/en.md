---
title: "Rainbow"
description: ""
---

Your task is to make a beautiful rainbow pattern made up of 100 vertical bars.

### How to solve it

- The top-left of the drawing canvas is `0,0`. The bottom-right is `100,100`.
- The rainbow is made up of `100` bars, each with a width of `1`, starting at the top (`0`) and being `100` high.
- The first bar should have an `x` of 1, and the final bar should have an `x` of 100.
- You will need a variable for `x`. When choosing its initial value, remember that it will be increased in the `repeat` block BEFORE drawing.
- You also need a variable for the `hue` of the color (set initially to `0`).
- You need to write a repeat loop that repeats 100 times.
- In each iteration of the repeat loop you need to increase `x` by 1 and increase the hue by `3`.
- You then need to use the `hsl` function to convert the color, and pass it to the `rectangle` function to draw.
