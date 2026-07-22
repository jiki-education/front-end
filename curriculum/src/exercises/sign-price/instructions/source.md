---
title: "Sign Price"
description: "Calculate the cost of painting a sign, letter by letter."
---

You run a sign-making shop. You charge $12 per letter for every sign you make. Spaces are free -- they don't cost anything.

Write a function called `signPrice` that takes the text for a sign and returns a formatted message with the total price.

To count the letters, loop through each character and skip any spaces. Multiply the count by 12 to get the price. Then return a string in the format `"That will cost $X"` where X is the price.

Examples:

- `signPrice("Hello")` returns `"That will cost $60"` (5 letters)
- `signPrice("Hi There")` returns `"That will cost $84"` (7 letters, space skipped)
- `signPrice("A")` returns `"That will cost $12"` (1 letter)
