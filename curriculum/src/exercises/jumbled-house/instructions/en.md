---
title: "Jumbled House"
description: ""
---

Your task is to rearrange the pieces of the house. They are both misplaced and the wrong sizes.

The purpose of this exercise is to encourage your slow, meticulous thinking. You should be able to solve this whole exercise by carefully working through the instructions without guessing at any numbers. Take your time.

Try and place each piece in the order they're listed below. When everything is correct you should have a scene that looks like this:

![Jumbled House](https://assets.exercism.org/bootcamp/graphics/jumbled-house-finished.png)

### Instructions

- The top-left of the canvas is `0,0`. The bottom-right is `100,100`.
- The frame of the house (the big rectangle) should be 60 wide and 40 height. It should have its top-left corner at 20x50.
- The roof sits snugly on top of the house's frame. It should overhang the left and right of the house by 4 on each side. It should have a height of 20, and its point should be centered horizontally.
- The windows are both the same size, with a width of 12 and a height of 13. They both sit 5 from the top of the house frame, and 10 inset from the sides.
- The door is 14 wide and 18 tall, and sits at the bottom of the house in the center.
- The little door knob has a radius of 1, is inset 1 from the right, and is vertically centered in the door.

### Functions

The house uses the following functions:

- `circle(x, y, radius, color)`
- `rectangle(x, y, width, height, color)`
- `ellipse(centerX, centerY, radiusX, radiusY, color)`
- `triangle(x1,y1, x2,y2, x3,y3, color)`
