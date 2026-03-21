---
title: "Raindrop Sounds"
description: "Turn numbers into raindrop sounds: Pling, Plang and Plong."
---

Raindrops is a version of the classic FizzBuzz challenge that's been used in programming interviews forever.

Your task is to convert a number into its corresponding raindrop sounds.

We do this by seeing what the number is divisible by (e.g. the number 10 is divisible by 1, 2, 5 and 10. The number 12 is divisible by 1, 2, 3, 4, 6 and 12).

If a given number:

- is divisible by 3, add "Pling" to the result.
- is divisible by 5, add "Plang" to the result.
- is divisible by 7, add "Plong" to the result.
- is not divisible by 3, 5, or 7, the result should be the number as a string.

You need to create a function called `raindrops` that takes the number as an input and returns its Raindrops sounds.

To solve this, you have two helpful functions:

- `concatenate(str1, str2, ...)`: Takes 2 or more strings and returns them combined into one.
- `numberToString(number)`: Takes a number as an input and returns it as a string.

### Examples

- `raindrops(28)` returns "Plong" because 28 is divisible by 7, but not 3 or 5.
- `raindrops(30)` returns "PlingPlang" because 30 is divisible by 3 and 5, but not 7.
- `raindrops(34)` returns "34" because 34 is not divisible by 3, 5, or 7.
