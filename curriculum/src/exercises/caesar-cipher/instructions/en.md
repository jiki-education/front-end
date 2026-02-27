---
title: "Caesar Cipher"
description: ""
---

The Caesar Cipher is one of the earliest and simplest encryption techniques. It was used by Julius Caesar to send secret messages to his generals.

<!-- TODO: Add photo of me dressed like Caesar -->

The cipher works by shifting each letter in the message by a fixed number of positions in the alphabet. For example, with a shift of 3, 'a' becomes 'd', 'b' becomes 'e', and so on. If the shift goes past 'z', it wraps around to the beginning of the alphabet.

Spaces should be kept as spaces (not shifted).

Create a function called `encode(message, shift)` that takes a lowercase message and a shift amount, and returns the encoded message.

For example:

- `encode("abc", 1)` returns `"bcd"`
- `encode("xyz", 3)` returns `"abc"` (wraps around)
- `encode("hello world", 5)` returns `"mjqqt btwqi"`

Hint: You'll want to break this problem down into smaller helper functions!
