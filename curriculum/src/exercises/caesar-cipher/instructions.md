---
title: "Caesar Cipher"
description: "Encrypt a secret message using an ancient Roman cipher."
---

The Caesar Cipher is one of the earliest and simplest encryption techniques. It was used by Julius Caesar to send secret messages to his generals.

The cipher works by shifting each letter in the message by a fixed number of positions in the alphabet. For example, with a shift of 3, 'a' becomes 'd', 'b' becomes 'e', and so on. If the shift goes past 'z', it wraps around to the beginning of the alphabet.

Spaces should be kept as spaces (not shifted).

Create a function called <define>`encode(message, shift)`</define> that takes a lowercase message and a shift amount, and returns the encoded message.

For example:

- `encode("abc", 1)` returns `"bcd"`
- `encode("xyz", 3)` returns `"abc"` (wraps around)
- `encode("hello world", 5)` returns `"mjqqt btwqi"`

Hint: You'll want to break this problem down into smaller helper functions!

### Random Fact

I was once MCing a tech conference in Braga in Portugal. Five minutes before I was about to come on stage, the organisers came up, and somewhat sheepishly asked me if I'd mind dressing up as Julius Caesar for the first part of the day to celebrate Braga's Roman heritage. Did I pull it off...?

<img
  src="/static/images/exercise-assets/caesar-cipher/jeremy-as-caesar.webp"
  alt="Jeremy dressed as Caesar"
  style="width: 100%; max-width: 300px; border: 5px solid var(--color-purple-500); padding: 4px; border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;"
/>
