---
title: "While Loops"
description: "A loop that keeps running while some condition stays true."
---

The next loop to know about is a <define>while</define> loop.

This says, "While some condition, run the loop." So we might have a rule that says you can only shoot five times in Space Invaders. So we'd have a loop here that says, well, while the number of shots is less than five, run a loop that allows someone to play the game.

```javascript
while (numShots < 5) {
  // shoot alien
  numShots++
}
```

Each time someone shoots, we increase the `numShots` by one, and eventually we'll hit five and the loop will exit.

Now, one problem with while loops is that it's quite easy to have bugs that mean the loop never ends. And these are called <define>infinite loops</define>, and they're one of the most common bugs in programs.

When your computer slows down, the fans start spinning, everything gets loud, that's often because someone's left an infinite loop that never ends in their code.
