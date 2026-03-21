---
title: "Snowman"
description: "Build a snowman from three circles."
---

This exercise introduces you to the `circle` function, which we use with 3 inputs:

- `cx`: The central horizontal (x) position of the center of the circle
- `cy`: The central vertical (y) position of the center of the circle
- `radius`: How big the circle is

This image should make things clearer:

<img src="/static/images/exercise-assets/snowman-basic/intro-circle.jpg" alt="Snowman" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

### Drawing a snowman

Your job is to draw three white circles to build a snowman. The snowman has:

- A large **base** circle at the bottom
- A medium **body** circle in the middle
- A small **head** circle at the top

All three circles should be centered horizontally on the canvas. Use the target image as a guide.

As before, you're drawing on a canvas that's 100 wide and 100 high. So the top-left of the canvas is `0,0`, the bottom right is `100,100`, and you can hover over the canvas to check where something needs to go. To make your life easier, all numbers in this exercise are **divisible by 5**.
