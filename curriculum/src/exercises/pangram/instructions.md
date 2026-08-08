---
title: "Pangram"
description: "Check if a sentence contains every letter of the alphabet, regardless of case."
---

Welcome to part 2 of the Pangram series. Remember, a pangram is a sentence using every letter of the alphabet at least once.

This exercise is a more complex version of the the previous Pangram exercise you solved, because it uses uppercase letters too. That adds a surprising amount of complexity.

Create a function called <define>`isPangram`</define> that takes a sentence as a string, and returns a boolean representing whether it is, or is not, a pangram.

We've given you your previous code as a starting point.

### Helper Functions

In addition to your existing helper function (which we suggested you called `includes`), we recommend you create two new helper functions to help you solve this. The functions names are standard names, which we recommend sticking to:

1. `indexOf(haystack, needle)`: A function that calculates **where** the needle is in the haystack. So rather than returning `true`/`false` like `includes`, it returns the **index** of the needle. For example, `indexOf("Jeremy", "r")` would return `2` (remember we count from 0).
2. `toLowerCase(someString)`: A function that takes a string and returns it converted to lowercase. For example, `toLowerCase("JeReMy")` would return `"jeremy"`.

Have fun!
