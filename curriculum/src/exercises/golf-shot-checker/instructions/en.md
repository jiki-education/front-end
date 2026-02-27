---
title: "Golf: Shot Checker"
description: ""
---

You're on the golf course and the golfer has hit the ball. Your job is to roll the ball and check if it lands in the hole!

You have three functions:

- `rollTo(x, y)` rolls the ball to position (x, y)
- `getShotLength()` returns how far the golfer hit the ball
- `fireFireworks()` celebrates the shot

The ball starts at x=29, y=75. Get the shot length, then roll the ball right one step at a time (shotLength + 1 steps). If the shot length is between 56 and 65 (inclusive), the ball is over the hole — roll it down 9 units to sink it. Then fire the fireworks!
