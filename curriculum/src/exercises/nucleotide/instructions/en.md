---
title: "Nucleotide"
description: ""
---

DNA is a long chain of other chemicals and the most important are the four nucleotides, adenine, cytosine, guanine and thymine. A single DNA chain can contain billions of these four nucleotides and the order in which they occur is important! We represent a DNA sequence as a string of characters such as "ATTACG". 'A' for adenine, 'C' for cytosine, 'G' for guanine, and 'T' for thymine.

Create a function called `countNucleotide` that takes a DNA strand and a single nucleotide character, and returns the count of how many times that nucleotide appears in the strand.

If the nucleotide character is not valid (not one of A, C, G, T), return `-1`.
If the strand contains any invalid characters, also return `-1`.

For example:

- `countNucleotide("GATTACA", "A")` returns `3`
- `countNucleotide("GATTACA", "T")` returns `2`
- `countNucleotide("GATTACA", "X")` returns `-1`

You'll need to write a helper function to check if a character is contained within a string.
