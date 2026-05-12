---
title: "Scenarios"
description: "Different starting conditions an exercise runs your single piece of code against, so you have to make it work for all of them."
---

Each exercise comes with different scenarios, different situations that your code needs to handle.

You'll see these as little buttons just above the output of each exercise. Each button refers to a different scenario. Your job is to write code that works for all of them, not just the first one. Let me say that again. You write your code once, but that same code runs for each scenario. The difference is that each scenario might be set up slightly differently, or the functions you're given might return slightly different things depending on which scenario you're in.

Take a golf game example. You might need to vary how far a ball rolls based on the return value of a function called `getShotLength`, which tells you how far the golfer has hit the ball. Imagine the player has had to swipe on their phone to say how far they've hit it.

The result that gets back to you is through this function. So in one scenario, you can use the `getShotLength` function, and it will return 23, a small swipe. In another, it returns 70, a long swipe. In another, it returns 45. Your code needs to roll the ball the right distance for each scenario with just one program, one set of code. You'll need to use the `getShotLength` function to see how far the shot went and then roll to that spot.

Scenarios make sure your code actually works properly. It's pretty easy to write code that works in one specific situation. It's much harder and more valuable to write code that works in lots of different situations. When you're solving exercises, start with the first scenario. Get that working. Then move on to the next scenario and get that working. As your code breaks on a different scenario, think about what is different and how your code needs to adapt.
