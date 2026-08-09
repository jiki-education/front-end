---
title: "Alphanumeric"
description: "Build functions to classify text as letters, numbers or both."
---

In this exercise, your task is to create functions that check whether a string contains letters and/or numbers.

You'll need to write three helper functions:

- <define>`isAlpha(string)`</define> — determines whether a string only consists of ASCII letters (e.g. "A", "a", "Hello")
- <define>`isNumeric(string)`</define> — determines whether a string only consists of numeric characters (e.g. "0", "1", "456")
- <define>`isAlphanumeric(string)`</define> — determines whether a string only consists of ASCII letters or numbers (e.g. "Hello", "42", "Hello42")

For any other symbols (e.g. "! ?") or non-ASCII characters (e.g. "じき", "正直"), all three functions should return false.

Then, write a <define>`whatAmI(string)`</define> function that uses those helpers to classify a string:

- Strings with only letters should return `"Alpha"`
- Strings with only numbers should return `"Numeric"`
- Strings with both letters and numbers should return `"Alphanumeric"`
- Everything else should return `"Unknown"`

### Using what you just learned

Although there are many valid ways to solve this exercise, the solution we want you to come up with uses a `continue` statement and the three functions above.

This exercise also challenges you to solve the whole thing in 42 lines of code or fewer. That target isn't necessarily the most production-quality solution. A couple of extra lines probably give a nicer one, and there are shorter solutions too. But it's a good goal to push your capabilities towards.

Have fun!
