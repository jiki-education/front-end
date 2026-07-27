---
title: "Luhn"
description: "Validate identification numbers like credit cards using the Luhn checksum."
---

We just looked at validating books' ISBN numbers. There's another common formula which is used to check numbers in lots of contexts, and that's the <define>Luhn formula</define>. It's most famously used to catch typos in credit card numbers.

### The Luhn check

The Luhn check has a number of steps:

- Starting from the **rightmost** digit and moving left, **double the value of every second digit**.
- If doubling a digit results in a number greater than 9, subtract 9 from it.
- Then add up all the digits.
- If the total is evenly divisible by 10, the number is valid.

For example, with `"067"` we follow the steps:

```
0   6   7     // original digits
0  12   7     // every second digit (from the right) doubled
0   3   7     // 12 is greater than 9, so subtract 9 → 3
       10     // Add the digits together
     true     // 10 is divisible by 10, so 067 is valid
```

### Your Job

Create a function called <define>`valid`</define> that takes a string and returns `true` if it passes the Luhn check and `false` if it does not.

The numbers are given as strings, and may contain spaces for readability (for example `"4539 1488 0343 6467"`). The spaces should be ignored.

A few important notes:

- The input may contain spaces - you should ignore them.
- If the input contains any other characters, you should return false.
- Strings of length 1 or less (once spaces are stripped) are **not** valid.

### Putting into practice what you've learned.

Although there are many ways to solve this exercise, the solution we want you to come up with uses a `for` loop.

You will also need the <a href="/concepts/type-conversion" target="_blank" rel="noopener noreferrer">`Number(str)`</a> function that we introduced in the last exercise.

Have fun!
