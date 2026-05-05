---
title: "Golf: Shot Checker"
description: "Work out whether a golf shot landed close enough to sink."
---

Welcome back to the golf course. In this exercise, you're going to build on the previous exercises but with a new twist.

In each scenario, you need to roll the ball a different amount depending on how far the golfer has hit it. You can get that length by using the `getShotLength()` function - it'll give you a different number for each Scenario.

You then need to roll the ball to that spot using the `rollTo(x, y)` function. As before, you need to roll it one step at a time, not just jump it to the end. But this time, if the golfer gets the ball in the hole, you need to animate that final part too, moving the ball down into the hole after it's reached the right spot.

Then finally, **if the ball landed in the hole**, once it's rolled to the bottom, it's time to celebrate, so shoot of some fireworks using the `fireFireworks()` function.

Two things to know:

1. A successful shot means the shot's length is `58`, `59`, `60`, `61`, or `62`.
2. You need to roll the ball down 9 units.

On this exercise, try and think through each step carefully and take things one step at a time. Good luck!
