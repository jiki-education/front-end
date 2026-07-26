---
title: "Luhn"
description: "Validate identification numbers like credit cards using the Luhn checksum."
---

The <define>Luhn formula</define> is a simple way to check whether a number is valid. It's used all over the place, most famously to catch typos in credit card numbers.

The numbers are given as strings, and may contain spaces for readability (for example `"4539 1488 0343 6467"`). The spaces should be ignored.

### The Luhn check

Starting from the **rightmost** digit and moving left, **double the value of every second digit**. If doubling a digit results in a number greater than 9, subtract 9 from it (so `8` doubled becomes `16`, then `16 - 9 = 7`).

Then add up all the digits. If the total is evenly divisible by 10, the number is valid.

For example, `"091"` becomes:

```
0   9   1     original digits
0  18   1     every second digit (from the right) doubled
0   9   1     18 is over 9, so subtract 9 → 9
```

The sum is `0 + 9 + 1 = 10`, which is divisible by 10, so `"091"` is valid.

A few important notes:

- Strings of length 1 or less are **not** valid.
- The input may only contain digits and spaces. Any other character makes it invalid.

Create a function called <define>`valid`</define> that takes a string and returns `true` if it passes the Luhn check and `false` if it does not.

Although there are many ways to solve this exercise, the solution we want you to come up with uses a `for` loop.
