---
title: "Repeat Without Count"
description: "Looping without knowing in advance how many times to repeat."
---

So far, when you've used the repeat loop, you've always specified a number that says how many times to repeat. Repeat five times, 10 times, 40 times. You've used a variable to do this too sometimes. But you've always told Jiki exactly how many times to repeat the loop. However, sometimes we don't know in advance how many times to repeat. Think about the maze. Way back at the start of this course, you solved the maze by writing out specific moves. You could see the maze, count the steps, and write the right number of moves.

But what if I said, "Write me some code that can solve any maze I give you?" That maze might need 10 steps, or 50, or 200. You have no idea in advance.

So you need a way of just telling Jiki to just keep going. Keep checking which way you can go, keep making decisions, keep moving forward, over and over until you're done.

And the way to do that is really simple. Just don't give the repeat keyword a number. Just leave those brackets empty. If you do this, Jiki will just keep on going until something else tells him to stop. Later on, we'll look at what those something elses are. But for now, he'll just keep going until the exercise is finished, or until he decides he's been going for absolutely ages, wants a break, and decides he's had enough.
