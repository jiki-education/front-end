---
title: "Structured House"
description: "Drive a whole house drawing from two size anchors."
---

Your task is to draw a house, building the whole thing from just two anchor variables: <define>`houseWidth`</define> and <define>`houseHeight`</define>.

We've set up the colors, the canvas width, and the two anchor variables for you. Everything else (where the house sits, the roof, the windows, the door, and the knob) should be derived from the two anchors and the fixed facts below.

**Think relationally!** If you do it right, you should be able to change just `houseWidth` and `houseHeight` and the whole house will resize correctly: staying centered horizontally, staying planted on the grass, and keeping its proportions. Don't hardcode positions you've worked out yourself. Build each one from the anchors.

<img src="/static/images/exercise-assets/structured-house/structured-house-finished.webp" alt="The same house drawn at three different widths and heights, each staying centered and planted on the grass" style="width: 100%; box-sizing: border-box; padding: 16px; background: #fff; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

### House Specifications

- The top-left of the drawing canvas is `0,0`. The bottom-right is `100,100`.
- The sky fills the canvas (from `0,0` to `100,100`).
- The grass is full width and sits at the bottom of the canvas with a height of `15`.
- The house is always centered horizontally on the canvas.
- The bottom of the house sits `5` below the top of the grass, and the house grows upward from there.
- The roof sits on top of the frame. It overhangs the left and right of the frame by `1/10th` of the frame's width, its height is `1/2` of the frame's height, and its peak is centered horizontally.
- The windows are each `1/5th` of the frame's width wide and `1/3rd` of its height tall. They sit `1/8th` of the frame's height below the top of the frame, and are inset from each side of the frame by `1/7th` of the frame's width.
- The door is `1/5th` of the frame's width wide and `1/2` of its height tall, centered horizontally, with its bottom on the bottom of the house.
- The door knob's radius is `1/10th` of the door's width. There is a gap of `1/10th` of the door's width between the knob and the right edge of the door. The knob is vertically centered in the door.

### Check it works!

Try changing the `houseWidth` and `houseHeight` variables. If your code is correct, the house will resize while staying centered and planted on the grass.
