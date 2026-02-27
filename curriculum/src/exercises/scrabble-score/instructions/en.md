---
title: "Scrabble Score"
description: ""
---

Scrabble is a word game where players place letter tiles on a board to form words. Each letter has a value, and a word's score is the sum of its letters' values.

Your task is to compute a word's Scrabble score by summing the values of its letters.

The letters are valued as follows:

- A, E, I, O, U, L, N, R, S, T = 1 point
- D, G = 2 points
- B, C, M, P = 3 points
- F, H, V, W, Y = 4 points
- K = 5 points
- J, X = 8 points
- Q, Z = 10 points

For example, the word "cabbage" is worth 14 points: 3 + 1 + 3 + 3 + 1 + 2 + 1.

You need to create two functions:

1. `letterValues()` - Returns a dictionary where each key is an uppercase letter and each value is its point value. We've given you a list of letter groups and their values as a starting point — convert this into a dictionary rather than typing it out manually.

2. `scrabbleScore(word)` - Takes a word and returns its total Scrabble score using the letter values dictionary.
