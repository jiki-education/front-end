---
title: "Wordle: Solver"
description: ""
---

Time to build a Wordle solver! You need to create a `processGame` function that takes no inputs and automatically solves the game.

You have three functions available:

- `getTargetWord()`: Returns the secret target word.
- `commonWords()`: Returns a list of 100+ possible words.
- `addWord(row, word, states)`: Adds a word to the board at the given row (1-6) with its states.

For each guess, compare it to the target word to determine the states (correct/present/absent), then add it to the board. Keep guessing until you find the right word or use all 6 slots.

The best guess is the **first word** in the commonWords list that matches your knowledge so far:

- Has all 'correct' letters in the right places
- Has all 'present' letters somewhere (but not in positions you know are wrong)
- Has no 'absent' letters

**Important:** Don't use getTargetWord() to cheat - only use it for checking your guess to generate states.
