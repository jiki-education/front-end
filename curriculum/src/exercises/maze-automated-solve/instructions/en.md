---
title: "Programmatically Solve a Maze"
description: "Write code that navigates any maze by itself."
---

In the first maze exercise you manually moved your character around the maze. Now you're ready to solve any maze programmatically using code!

To make that possible, you have three new functions:

- `canTurnLeft()`: returns `true` if the space to the character's left is not a wall.
- `canTurnRight()`: returns `true` if the space to the character's right is not a wall.
- `canMove()`: returns `true` if the space ahead of the character is not a wall.

When we match those up with the `move()`, `turnLeft()` and `turnRight()` you had before, it's possible to write an algorithm to solve **any** maze. "Algorithm" is a posh word that just means "a way of doing something". It's like a formula or a recipe.

Further down in the instructions, I'll tell you the algorithm ready for you to solve. But I want you to try and work it out yourself first as a little logic puzzle. If you know whether you can turn left right or move ahead, how can you solve any maze I give you?

Once you've got it, or given up, scroll down to see the answer and what you need to write in code.

<hr style="border-top: 1px solid var(--color-gray-200); margin:40px 0"/>

### The Algorithm

OK - that was a hard ask so I imagine you might have had some ideas but not got the whole thing. Here are the steps you need to follow:

- If you can turn left, turn left and move forward
- Otherwise, if you can move forward, move forward.
- Otherwise if you can turn right, turn right and move forward.
- Otherwise turn around

If you do that, you can solve any maze!

Write those instructions out in code. Have fun!
