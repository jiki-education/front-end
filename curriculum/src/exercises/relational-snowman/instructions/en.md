---
title: "Relational Snowman"
description: "Rebuild your snowman so all sizes scale from one variable."
---

Your task is to rewrite the snowman so all the sizes and positions are derived from a single `size` variable using arithmetic.

Depending on the `size` you choose, the snowman should grow.

<img
  src="/static/images/exercise-assets/relational-snowman/sizes.webp"
  alt="Snowman at sizes 1 through 5"
  style="width: 100%; max-width: 600px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;"
/>

### How it works

- The top-left of the drawing canvas is `0,0`. The bottom-right is `100,100`.
- You have a pre-written variable `snowmanX` for the center of the image and a `size` variable that you can change from `1` to `5` to grow the snowman.
- You need to derive all other variables using arithmetic expressions.
- The radius of the head is `size * 2`, the body's radius is `size * 3`, and the base's radius is `size * 4`.
- The circles should touch each other: the body sits directly above the base, and the head sits directly above the body. (Our snowman is a little more precarious than in previous exercises - every snowball is positioned exactly on the one below it without them melting into each other. It must be a very icy day!)
- The bottom of the base circle sits `size` from the bottom.
- You need to calculate the centers of all three snowballs.

### Variables

Your task is to set these variables from the instructions above.

- `headRadius`: derive from `size`
- `bodyRadius`: derive from `size`
- `baseRadius`: derive from `size`
- `baseY`: derive from `size` and `baseRadius` (the base sits on the ground)
- `bodyY`: derive from `baseY`, `baseRadius`, and `bodyRadius`
- `headY`: derive from `bodyY`, `bodyRadius`, and `headRadius`

### Play with size

You can change the size from `1` to `5` and the snowman should grow. Remember to press "Run code" once you change it.
