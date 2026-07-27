---
title: "Anagram"
description: ""
---

At a garage sale, you find a lovely vintage typewriter at a bargain price! However, whenever you type a word, the letters come out in the wrong order. Sometimes they're actually the letters you wrote, sometimes it gets really confused and outputs totally wrong letters.

For example, when you first typed the word "stone", it output "banana". Very frustrating. However, the second time you typed "stone", it output "notes" and you realised that while still extremely annoying, this could actually have a useful function - finding anagrams - two words that contain the same letters (e.g. "stone" and "notes").

### Your Job

You decided to write a quick program, which takes all the words the typewriter outputs, along with the word you typed, and get a list of the ones that are actually anagrams.

Create a function called <define>`findAnagrams(word, possibilities)`</define> that takes a target word (a string) and a list of possible anagrams, and returns which of the possibilities are actually anagrams of the target.

An anagram is a rearrangement of letters to form a new word. For example, 'owns' is an anagram of 'snow'. Important rules:

- A word is NOT its own anagram (e.g., 'stop' is not an anagram of 'stop')
- Matching is case-insensitive (e.g., 'PoTS' is an anagram of 'sTOp')
- Return anagrams with their original casing from the possibilities list
- Results should be sorted alphabetically

Example: `findAnagrams('stone', ['stone', 'Seton', 'banana', 'tons', 'notes', 'tones'])` returns ['Seton', 'notes', 'tones']
