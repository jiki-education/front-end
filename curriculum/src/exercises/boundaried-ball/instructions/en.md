---
title: "Boundaried Ball"
description: ""
---

In this exercise, you'll create a ball and make it bounce off the walls of a game area.

You have a `Ball` class that you can create an instance of using `new Ball()`. The ball has these properties:

- `cx` and `cy`: the center coordinates of the ball (read-only)
- `radius`: the size of the ball (read-only)
- `xVelocity` and `yVelocity`: how the ball moves each step (you can change these)

You also have a function:

- `moveBall(ball)`: moves the ball according to its velocity

The game area ranges from 0 to 100 in both directions.

Your job is to:

1. Create a Ball instance
2. Loop 376 times
3. Each loop, check if the ball is at or past a wall and reverse its velocity
4. Call `moveBall(ball)` to move it

The velocities should always be `1` or `-1`. The ball should never overlap the edge of the game area.
