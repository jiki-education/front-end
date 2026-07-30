---
title: "Wordle: Process Guess"
description: "Check a Wordle guess and work out which letters are correct."
---

Welcome to Wordle! The game works like this: there is a correct secret word, and you have 6 guesses to get it right. For each guess, if a letter is correct it goes green, if a letter is present in the word but in the wrong place it goes yellow, and if a letter is missing it goes grey.

Your job is to create a function called <define>`processGuess`</define> that takes two inputs: the secret target word, and the guess the player has made. You should work out the state of each letter then call the <define>`colorRow(1, states)`</define> function with an array of states for each letter: either `"correct"`, `"present"`, or `"absent"`.

For example, if the guess was correct, you would call:

```
colorRow(1, ["correct", "correct", "correct", "correct", "correct"])
```

You can build up the array of states using the <define>`push`</define> method, which adds an element onto the end of an array. For example, `states.push("correct")` adds `"correct"` to the end of the `states` array.
