---
title: "Structured House"
description: "Drive a whole house drawing from a handful of anchor variables."
---

Your task is to use variables to build the house.

Change all the inputs in the drawing function calls to use variables.

Set all the variables at the top before the first functions are used. We've set the first few to get you started.

Every variable should either be:

- A number that is specified in the instructions (e.g. the height of the frame); or
- A formula between two variables (e.g. `roofLeft = houseLeft - roofOverhang`) or a variable and a number specified in the instructions (e.g. `doorKnobRight = doorRight - 1`).

Do **not** manually set variables to numbers you've calculated yourself (e.g. do not set `roofLeft = 16`).

The purpose of this exercise is to keep pushing you towards structured, ordered thinking. Take your time.

As a reminder, the house should continue to look like this:

<img src="/static/images/exercise-assets/structured-house/example.webp" alt="A simple house drawing with a triangular roof, two windows, a door with a knob, and grass" style="width: 100%; max-width: 400px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

### House Instructions

- The top-left of the drawing canvas is `0,0`. The bottom-right is `100,100`.
- The sky fills the canvas (from `0,0` to `100,100`).
- The grass is full width (from `0` to `100`) and sits on the bottom of the canvas at `100` with a height of `20`.
- The frame of the house (the big rectangle) should be `60` wide and `40` tall. Its top-left corner should be at `20,50`.
- The roof sits snugly on top of the house's frame. It should overhang the left and right of the house by `4` on each side. It should have a height of `20`, and its point should be centered horizontally (at `50`).
- The windows are both the same size, with a width of `12` and a height of `13`. They both sit `5` from the top of the house frame, and `10` inset from the sides.
- The door is `14` wide and `18` tall, and sits at the bottom of the house in the center.
- The little door knob has a radius of `1`, is inset `1` from the right, and is vertically centered in the door.
