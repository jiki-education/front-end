---
title: "Break"
description: "Exiting a loop early when a condition is met."
---

The `break` keyword can be used anywhere in the body of any loop.

The bit between the curly braces, that's the body. And when Jiki sees it, he'll exit out of the loop immediately and move on to whatever code is below the loop.

So if we have a constraint that says run this loop 50 times, but we wanna stop if the user shoots five times, we could have a for loop at the top that says from `i = 0` to less than 50.

But then we could have a condition in the middle of the loop that says `if numShots >= 5`, then break, stop the loop.
