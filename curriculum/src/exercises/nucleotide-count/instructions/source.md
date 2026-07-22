---
title: "Nucleotide Count"
description: "Count all the different nucleotides in a DNA strand."
---

DNA is a long chain of other chemicals and the most important are the four nucleotides, adenine, cytosine, guanine and thymine. A single DNA chain can contain billions of these four nucleotides and the order in which they occur is important! We call the order of these nucleotides in a bit of DNA a "DNA sequence".

We represent a DNA sequence as an ordered collection of these four nucleotides and a common way to do that is with a string of characters such as "ATTACG" for a DNA sequence of 6 nucleotides. 'A' for adenine, 'C' for cytosine, 'G' for guanine, and 'T' for thymine.

Create a function called `countNucleotides` that takes a DNA strand, and outputs a dictionary whose keys are the DNA letters, and the values are the amount of times those appear.

If the strand contains any invalid characters, return `false`.

For example:

- `countNucleotides("GATTACA")` returns `{ "A": 3, "C": 1, "G": 1, "T": 2 }`
- `countNucleotides("INVALID")` returns `false`
