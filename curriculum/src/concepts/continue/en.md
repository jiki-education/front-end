---
title: "Continue"
description: "Using the `continue` keyword inside a loop to skip the rest of this iteration and jump straight to the next one."
---

There are some times we might want to skip a specific iteration of a loop instead of breaking out of it. Imagine we only want to do things for odd numbers.

We want to be able to say if `i` is odd, don't run the loop this time.

But we don't want to fully exit from the loop. We just want to skip this single iteration and then look at the next one.

And for this, we have another keyword called `continue`.

When Jiki sees continue, he just jumps back to the top of the loop for the next iteration. So in a for-of loop, if he sees continue, he moves on to the next item in the list.

In a for loop, he hits the increment of the `i++` and then starts the next iteration.
