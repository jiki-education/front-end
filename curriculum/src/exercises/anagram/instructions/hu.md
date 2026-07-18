---
title: "Anagram"
description: ""
---

At a garage sale, you find a lovely vintage typewriter at a bargain price! However, all words it types are garbled - it rearranges the letters due to random delays. You realize this quirk allows you to generate anagrams!

Create a function called `findAnagrams(word, possibilities)` that takes a target word (a string) and a list of possible anagrams, and returns which of the possibilities are actually anagrams of the target.

An anagram is a rearrangement of letters to form a new word. For example, 'owns' is an anagram of 'snow'. Important rules:

- A word is NOT its own anagram (e.g., 'stop' is not an anagram of 'stop')
- Matching is case-insensitive (e.g., 'PoTS' is an anagram of 'sTOp')
- Return anagrams with their original casing from the possibilities list
- Results should be sorted alphabetically

Example: findAnagrams('stone', ['stone', 'Seton', 'banana', 'tons', 'notes', 'tones']) returns ['Seton', 'notes', 'tones']
