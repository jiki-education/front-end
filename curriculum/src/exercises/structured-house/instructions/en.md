---
title: "Structured House"
description: ""
---

Your task is to draw a house using variables!

<!-- TODO: Add gif showing house moving when houseLeft changes -->

### The Challenge

Draw the house shown in the image using variables for all positions, sizes, and colors. We've set up the color variables for you — you need to add everything else.

**Think relationally!** Try to set up your variables so that everything is connected. For example, the windows and door positions should be based on the house position. If you do it right, you should be able to change just `houseLeft` and `houseTop` and the entire house (frame, roof, windows, door, knob) will move together!

### House Specifications

- The top-left of the drawing canvas is `0,0`. The bottom-right is `100,100`.
- The sky fills the canvas (`0,0` to `100,100`).
- The grass is full width, sits at the bottom with a height of `20`.
- The house frame is `60` wide and `40` tall, with its top-left corner at `20,50`.
- The roof sits on top of the frame, overhanging by `4` on each side. It's `20` tall, with its peak centered horizontally.
- Both windows are `12` wide and `13` tall. They sit `5` below the top of the frame and `10` inset from each side.
- The door is `14` wide and `18` tall, centered at the bottom of the house.
- The door knob has a radius of `1`, is inset `1` from the right of the door, and is vertically centered in the door.
