---
title: "Collatz Conjecture"
description: "Explore a famous maths puzzle with your own function."
---

One evening, you stumbled upon an old notebook filled with cryptic scribbles, as though someone had been obsessively chasing an idea. On one page, a single question stood out: **Can every number find its way to 1?** It was tied to something called the **Collatz Conjecture**, a puzzle that has baffled thinkers for decades.

The rules are deceptively simple:

1. Choose a number.
2. If it's even, divide it by 2.
3. If it's odd, multiply it by 3 and then add 1.
4. Repeat with the result, continuing indefinitely.

For example, starting with 12:

```
12 → 6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1
```

Counting from the second number (6), it took 9 steps to reach 1.

Create a function called `collatzSteps` that takes one input, a number. Return **how many steps** it takes to get from any given number to 1, following the rules of the Collatz Conjecture.
