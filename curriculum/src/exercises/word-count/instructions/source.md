---
title: "Word Count"
description: "Count how many times each word appears in a sentence."
---

You teach English as a foreign language to high school students. You've decided to base your entire curriculum on TV shows. You need to analyze which words are used, and how often they're repeated.

Your task is to count how many times each word occurs in a subtitle of a drama. The subtitles use only ASCII characters.

The characters often speak in casual English, using contractions like _they're_ or _it's_. Though these contractions come from two words, the contraction is considered a single word.

Words can be separated by any form of punctuation (e.g. ":", "!", or "?") or spaces. The only punctuation that does not separate words is the apostrophe in contractions.

Numbers are considered words. If the subtitles say "It costs 100 dollars" then "100" will be its own word.

Words are case insensitive. For example, the word "you" occurs three times in: "You come back, you hear me? DO YOU HEAR ME?"

Create a function called `countWords` that takes a sentence as its input, and returns a dictionary with words as keys and their frequencies as values.
