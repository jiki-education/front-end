---
title: "Wordle: Process Game"
description: "Process a whole Wordle game, colouring each guess row by row."
---

Now that you can process a single guess, it's time to process a whole game!

Create a function called `processGame` that takes two inputs:

1. The secret target word.
2. A list of guesses the player has made.

You should work out the state of each row then call the `colorRow(row, states)` function with the row number (`1-6`) and a list of states for each letter.

For example, if the first guess was correct:

```
colorRow(1, ["correct", "correct", "correct", "correct", "correct"])
```
