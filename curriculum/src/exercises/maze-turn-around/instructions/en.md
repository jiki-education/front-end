---
title: "Turn Around"
description: "Create a turn-around function for the maze."
---

In the last exercise you worked out how to solve the maze automatically. Great work!

One of the nice things about the solution is that the code reads very naturally. It's very aligned to the algorithm. Except for one bit...

Did you find it a bit unsatisfying that you had to use `turnLeft()` twice to turn around, rather than having a `turnAround()` function?

Well, this is your opportunity to fix that!

Create a new function called `turnAround` at the top of your code. It has no inputs and doesn't return anything. It should simply call `turnLeft()` twice.

Then use that function in the solution in the final else statement.
