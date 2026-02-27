---
title: "Alphanumeric"
description: ""
---

In this exercise, your task is to create functions that check whether a string contains letters and/or numbers.

You'll need to write three helper functions:

- `isAlpha(string)` — determines whether a string only consists of ASCII letters (e.g. "A", "a", "Hello")
- `isNumeric(string)` — determines whether a string only consists of numeric characters (e.g. "0", "1", "456")
- `isAlphanumeric(string)` — determines whether a string only consists of ASCII letters or numbers (e.g. "Hello", "42", "Hello42")

For any other symbols (e.g. "! ?") or non-ASCII characters, all three functions should return false.

Then, write a `whatAmI(string)` function that uses these helpers to classify a string:

- Strings with only letters should return "Alpha"
- Strings with only numbers should return "Numeric"
- Strings with both letters and numbers should return "Alphanumeric"
- Everything else should return "Unknown"
