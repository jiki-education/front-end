---
title: "Wordle: Process Guess"
description: "Check a Wordle guess and work out which letters are correct."
---

Welcome to Wordle! The game works like this: there is a correct secret word, and you have 6 guesses to get it right. For each guess, if a letter is correct it goes green, if a letter is present in the word but in the wrong place it goes yellow, and if a letter is missing it goes grey.

Your job is to create a function called `processGuess` that takes two inputs: the secret target word, and the guess the player has made. You should work out the state of each letter then call the `colorRow(1, states)` function with a list of states for each letter: either `"correct"`, `"present"`, or `"absent"`.

For example, if the guess was correct, you would call:

```
colorRow(1, ["correct", "correct", "correct", "correct", "correct"])
```

You also have access to the `push(list, element)` function which adds an element to a list and returns the new list.
