---
title: "Reverse String"
description: "Flip a piece of text backwards."
---

Reversing strings (reading them from right to left, rather than from left to right) is a surprisingly common task in programming.

For example, in bioinformatics, reversing the sequence of DNA or RNA strings is often important for various analyses, such as finding complementary strands or identifying palindromic sequences.

Your task is to create a function called <define>`reverse`</define>, which takes a string as its input, and returns the reversed version.

Examples:

- Turn "stressed" into "desserts"
- Turn "strops" into "sports"
- Turn "racecar" into "racecar" (a palindrome)

### Those last two scenarios...

The final two scenarios look strange, don't they? What's going on?

It turns out that lots of emojis are actually made up of other emojis joined together with hidden (zero width) spaces.

The family emoji (👩‍👩‍👧‍👦) is made up of two women and two children. When it's reversed, you can see the individual characters (👦‍👧‍👩‍👩).

The other one is a rainbow and a flag (🌈‍️🏳). When you reverse the order to get the flag then the rainbow, it becomes a rainbow flag (🏳️‍🌈️)!

If you build your result one character at a time, these should just work. If you reach for a cleverer trick instead, you might find the emojis break apart.
