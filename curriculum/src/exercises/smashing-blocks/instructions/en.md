---
title: "Smashing Blocks"
description: ""
---

In the previous exercise, you got the ball bouncing around the game area. Now it's time to add some blocks!

You have a new `Block` class. When you create an instance using `new Block(left, top)`, you specify its left and top position. All blocks are `16` wide.

The block has `top`, `left`, `width` and `height` properties which you can read. It also has a `smashed` property you can read and write.

You have two jobs:

1. Create 5 blocks. They should all have a top of `31`. The first should have a left of `8`, and then they should be evenly distributed along the game area (with a gap of `1` between them).

2. Handle what happens when the ball hits a block. When this happens, set the block's `smashed` property to `true` (which makes it disappear) and reverse the ball's direction. Once all blocks are smashed, stop moving the ball.

For this exercise, the ball will only ever hit the bottom of a block, which simplifies the collision logic.
