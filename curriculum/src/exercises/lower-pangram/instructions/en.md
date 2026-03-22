---
title: "Lower Pangram"
description: "Check if a sentence uses every letter of the alphabet."
---

A pangram is a sentence using every letter of the alphabet at least once.

In this exercise, you only need to handle lowercase letters. The input will only contain lowercase letters and other characters like spaces, numbers, or punctuation — no uppercase letters.

Your task is to write two functions:

1. `includes(str, target)` — takes a string and a single character, and returns `true` if the character appears in the string, or `false` if it doesn't.

2. `isPangram(sentence)` — takes a sentence and returns `true` if it contains every letter from a to z at least once, or `false` otherwise. This function should use your `includes` function.

The best known English pangram is: "the quick brown fox jumps over the lazy dog"
