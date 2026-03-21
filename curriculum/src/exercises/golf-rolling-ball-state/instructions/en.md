---
title: "Golf: Rolling Ball"
description: "Roll a golf ball into the hole by tracking its position."
---

We're back in the world of building a golf game, but this time what we're building has changed.

Instead of the `roll()` function we had before, we now have a `moveTo(position)` function that moves the ball to a spot instantly.

Now, when the player hits the ball, we could just move it directly to the final place, but it's very unsatisfying seeing it not animate. So instead we want to use `moveTo(position)` lots of time to make it look like it's rolling.

The ball starts at position **28** and needs to reach position **88**.

You must solve this in **5 lines of code**. Good luck!
