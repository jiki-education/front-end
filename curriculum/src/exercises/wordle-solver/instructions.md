---
title: "Wordle: Solver"
description: "Build a solver that plays a whole game of Wordle by itself."
---

In the last Wordle exercise, you processed a game where the guesses were handed to you. This time, you're sitting on the other side and being the one that actually works out the guesses.

Your job is to create a new function called `solveWordle()`, where you keep guessing words until you get the correct word. You have to solve the game as efficiently as possible (using the fewest words you can).

You have a new <define>`commonWords()`</define> function, which returns an array of the 100+ words that you can use in the game. These are the words that you should work through. You should always start by reading the first word from that array and guessing that, then working through, finding the next possible valid word and guessing that next etc.

You have a <define>`guess(word)`</define> function that returns an array of `"correct"`, `"present"`, `"absent"` for each letter.

The key to this exercise is thinking through how to remember the previous words and the results of calling `guess`, and use knowledge to continuously find the most efficient path to victory.

### An example

1. You read the first word from the array, which is `"which"`
2. You use `guess("which")`, which returns `["correct", "present", "absent", "absent", "absent"]`.
3. You choose the next word in the common words array that starts with `"w"` and has an `"h"` in the third, fourth or fifth spots.
4. Go to (2)...

Good luck and have fun!
