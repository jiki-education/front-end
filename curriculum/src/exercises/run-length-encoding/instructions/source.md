---
title: "Run-Length Encoding"
description: "Compress and decompress text by counting runs of repeated characters."
---

<define>Run-length encoding</define> is a simple form of compression. Runs of the same character in a row are replaced by a count followed by that single character. Characters that appear only once are left as they are, with no count in front of them.

For example, `"AABBBCCCC"` encodes to `"2A3B4C"`, and `"XYZ"` (no repeats) encodes to just `"XYZ"`.

Whitespace counts as a character like any other, so `"  hsqq qww  "` encodes to `"2 hs2q q2w2 "`.

### Two functions

Write two functions:

- <define>`encode`</define> takes a string and returns its run-length encoded form.
- <define>`decode`</define> takes an encoded string and returns the original text back.

Decoding reverses the process: a number tells you how many times to repeat the character that follows it. Remember that a run can be longer than 9, so a count can have more than one digit (for example `"12W"` means twelve `W`s).

### Putting into practice what you've learned.

Although there are many ways to solve this exercise, the solution we want you to come up with uses the type of `for` loop you learned in the last video. Check the concepts at the bottom if you need a reminder on the syntax as it's quite ugly!

Have fun!
