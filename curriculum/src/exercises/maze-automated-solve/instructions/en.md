---
title: "Programmatically Solve a Maze"
description: "Write code that navigates any maze by itself."
---

In the first maze exercise you manually moved your character around the maze. Now you're ready to solve any maze programmatically using code!

To make that possible, you have three new functions:

- `canTurnLeft()`: returns `true` if the space to the character's left is not a wall.
- `canTurnRight()`: returns `true` if the space to the character's right is not a wall.
- `canMove()`: returns `true` if the space ahead of the character is not a wall.

With those three functions and the `move()`, `turnLeft()` and `turnRight()` you had before, you can solve any maze.

Spend a little time trying to work out how (maybe 15-30 minutes). Treat it as a fun logic puzzle. Get some paper and draw things out.

The algorithm is:

- If you can turn left, turn left and move forward
- Otherwise, if you can move forward, move forward
- Otherwise if you can turn right, turn right and move forward
- Otherwise turn around and move forward

This exercise is broken into different tasks. As you complete each task, more scenarios will pass!
