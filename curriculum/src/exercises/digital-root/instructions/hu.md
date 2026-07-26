---
title: "Digital Root"
description: "Collapse a number down to a single digit by repeatedly summing its digits."
---

The digital root of a number is what you get when you keep adding its digits together until only a single digit is left.

If adding the digits once still leaves you with more than one digit, you add the digits of _that_ result, and keep going until a single digit remains.

For example, to find the digital root of `942`:

```
9 + 4 + 2 = 15
1 + 5 = 6
```

So the digital root of `942` is `6`.

A number that is already a single digit (like `7`) is its own digital root.

Create a function called `digitalRoot` that takes a number and returns its digital root.

Although there are many ways to solve this exercise, the solution we want you to come up with uses a `while` loop.
