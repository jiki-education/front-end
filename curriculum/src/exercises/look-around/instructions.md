---
title: "Look Around"
description: "Build the functions that check what's around you in the maze."
---

Last time you added a new function to help navigate the maze: <define>`turnAround()`</define>. We've got your code on the left for you to continue working on.

This time we've removed three of the functions you were previously relying on. Your job in this exercise is to implement them yourself!

### The functions you need to write

The three functions you need to create are <define>`canTurnLeft()`</define>, <define>`canTurnRight()`</define> and <define>`canMove()`</define>.

None of the functions have any inputs. All should return a boolean specifying whether it's possible to move in that direction.

To help you, we've added a new <define>`look(direction)`</define> function. This function takes one input - a direction that can be `"left"`, `"right"`, or `"ahead"`. It returns one of:

- `"start"` (Where you start)
- `"target"` (Where you're trying to get to)
- `"empty"` (The route forward!)
- `"fire"` (Careful!)
- `"poop"` (Ewww)
- `"wall"` (Ouch!)

### Notes to help you

Here are three notes to help you.

1. A best practice in an exercise like this is to **start by creating the functions** that the code needs to run (i.e. `canTurnLeft()`, `canTurnRight()` and `canMove()`). Set their return values to be some sensible default (either `true` or `false` in this case). You can then implement the logic of each function and make some progress each time, rather than just consistently getting an error that a function doesn't exist until you've written the whole program.
2. **You shouldn't need to change any of your existing code** for this exercise. Instead add the three functions to the top of the code.
3. You can write **more functions** than just the ones required if it helps you.
