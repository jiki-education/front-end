---
title: "Golf: Shot Checker"
description: "Work out whether a golf shot landed close enough to sink."
---

Welcome back to the golf course. So far you've only been rolling the ball horizontally. When it got to the hole, it just sat above it. Now we're going to actually animate it down into the hole.

The first change is that the `rollTo` function now has inputs for `x` and `y`. Just like before you need to roll it one step at a time, not just jump it to the end. But this time, if the golfer gets the ball in the hole, you need to animate that final part too, moving the ball down into the hole after it's reached the right spot.

Then finally, **if the ball landed in the hole**, once it's rolled to the bottom, it's time to celebrate, so shoot of some fireworks using the `fireFireworks()` function.

A few things to know:

1. The ball starts on the tee at `x = 28`, `y = 75`, and rolls one step at a time.
2. A successful shot means the shot's length is `58`, `59`, `60`, `61`, or `62`.
3. You need to roll the ball down 9 units.

On this exercise, try and think through each step carefully and take things one step at a time. Good luck!
