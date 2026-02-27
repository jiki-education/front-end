---
title: "Solve a Maze with Repeat"
description: ""
---

You've been given a working solution to a maze, but it's very long and repetitive. Your job is to refactor the code using `repeat` loops to make it shorter.

Look for groups of consecutive `move()` calls. Each group can be replaced with a single `repeat` loop.

For example, instead of:

```
move();
move();
move();
```

You can write:

```
repeat(3) {
  move();
}
```

Your solution must be **22 lines of code or fewer**.
