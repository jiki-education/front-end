---
title: "Simple Pangram"
description: "Check if a sentence uses every letter of the alphabet."
---

A <define>pangram</define> is a sentence that uses **every letter of the alphabet at least once**. The best known English pangram is "the quick brown fox jumps over the lazy dog"!

The next three exercises are all going to be about determining if sentences are pangrams.

In this first exercise, you only need to handle lowercase letters. The input will only contain lowercase letters and other characters like spaces, numbers, or punctuation, but no uppercase letters.

Your task is to write <define>`isPangram(sentence)`</define>, which takes a sentence as an input and returns `true` if it contains every letter from "a" to "z" at least once, or `false` if it doesn't.

### Helper functions

To pass the exercise, you're not allowed to use nested loops in this exercise. Instead, as in the last exercise, the key to is to create a **helper function** which `isPangram(...)` uses.

This helper function will help you determine whether one string contains another string. We recommend you call this function `includes` and call its inputs <define>`haystack`</define> and <define>`needle`</define>. The idea is that we want to "find the needle in the haystack" - an old English phrase.

If creating multiple functions feels overwhelming, you might like to solve the exercise without the helper function first, using a nested loop, then think about how to break that into a helper function afterwards.

Have fun!
