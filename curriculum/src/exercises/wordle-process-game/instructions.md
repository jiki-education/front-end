---
title: "Wordle: Process a Game"
description: "Process a whole Wordle game, coloring each guess row by row."
---

We're back with the Wordle game, and now it's time to process the whole game, not just a single guess!

Once you complete this exercise, you'll unlock a **Premium Challenge** where you create a bot to actually play the whole game from start to finish, making your own guesses as you go. It's by far the most advanced challenge yet!

### This exercise

For now, you need to create a function called <define>`processGame(target, guesses)`</define> that takes two inputs: the secret target word, and an array of the guesses the player has made.

You should work out the state of each row then call the <define>`colorRow(row, states)`</define> function with the row number (`1-6`) and an array of states, one for each letter.

For example, if we called `processGame("crane", ["spoil", "trace", "crane"])`, then we'd expect your code to use the `colorRow` function three times:

```javascript
colorRow(1, ["absent", "absent", "absent", "absent", "absent"])
colorRow(2, ["absent", "correct", "correct", "present", "correct"])
colorRow(3, ["correct", "correct", "correct", "correct", "correct"])
```

We've put your code from the previous exercise in the editor as your starting point. Think about how you can make your existing code **more generic** to make this work. Good luck!

### Bonus: a new rule

There's one Wordle rule that we've skipped over so far...

If a letter appears twice in your guess but only once in the target word:

- If either one is in the right place, that one goes green and the other goes gray.
- If they're both in the wrong places, the first goes yellow and the second goes gray.

The same idea scales up: three in a guess and two in the word means two get colored and the third goes gray.

Run the second bonus scenario and look at the `"swiss"` row. The target word is `"swims"`, which has two `"s"`s in it, and both are already green: the one at the start and the one at the end. But your code also colors the fourth square yellow, which tells the player there's _another_ `"s"` still to find. There isn't. That fourth square should be gray.

You need to partially solve the issue for the first bonus scenario (so start there!), then fully solve the problem for the second one.

This task is a challenge! **Remember it's a bonus, you don't have to complete it!**
