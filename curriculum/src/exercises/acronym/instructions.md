---
title: "Acronym"
description: "Turn a phrase into its acronym, ignoring punctuation along the way."
---

You've already solved simple three letter acronyms like turning `Portable Network Graphics` into `PNG`.

However, on this exercise, we're taking it one step further and dealing with all acronyms - not just three letter ones. And this is much tougher...

Your job is to write a function called `acronym(phrase)` that takes a phrase and returns its acronym.

## The rules

A new word begins after a **space** or a **hyphen** (`-`). Every other character — commas, apostrophes, underscores, exclamation marks, and so on — is **not** a separator and never becomes part of the acronym. Only letters count.

| Phrase                    | Acronym |
| ------------------------- | ------- |
| As Soon As Possible       | ASAP    |
| Liquid-crystal display    | LCD     |
| Thank George It's Friday! | TGIF    |

## Heads up

We've not given you any of the more advanced JavaScript methods you see later in the course (nothing to magically uppercase a letter or tell you whether a character is a letter in the first place). You'll need to build all those helper functions yourself before you can put the whole thing together.

This one is trickier than it sounds. Have fun!
