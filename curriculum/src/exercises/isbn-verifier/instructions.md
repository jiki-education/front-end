---
title: "ISBN Verifier"
description: "Check whether a book's ISBN number is valid."
---

Every book has an ISBN - a 10 digit number to uniquely identify it. Each ISBN is unique and follows a specific format. There is also a formal verification process to check that a string is an ISBN, which you're going to make in this exercise.

ISBNs normally contain dashes and look like: `3-598-21508-8`

(There are also 13 digit ISBNs, but you can safely ignore those for this exercise!)

### Verifying an ISBN

To verify an ISBN, we:

- Start at the left and add together each digit multiplied by a weight counting down from 10 to 1.
- Get the remainder of that total divided by 11.
- Check whether that remainder is zero.

For example, for the ISBN `3-598-21508-8`, we would check whether:

```
(3*10 + 5*9 + 9*8 + 8*7 + 2*6 + 1*5 + 5*4 + 0*3 + 8*2 + 8*1) % 11 === 0
```

Since the result is 0, this proves that our ISBN is valid.

A couple more important notes:

- Sometimes an ISBN can end with an X. If that's the case, the X represents `10`. If the X appears anywhere else, the ISBN is invalid.
- ISBNs may be written with or without hyphens.
- Any other characters make the ISBN invalid.

### Your job

Create a function called <define>`isValidIsbn(isbn)`</define> that takes an ISBN string and returns `true` if it is valid and `false` if it is not.

### The Number(...) function

One thing we've not covered yet, which you need to know about, is the `Number(str)` function. This is a function which takes a string and returns that string as a number. So if you write `Number("1234")` you get `1234`. It's a weird function because it starts with a capital letter. Don't worry about that for now - we'll explain why that's the case much later on.

Learn more on the <a href="/concepts/type-conversion" target="_blank" rel="noopener noreferrer">Type Conversion concept page</a>.

### Using what you just learned

As in the last exercise, although there are many valid ways to solve this exercise, the solution we want you to come up with uses a `continue` statement.

The bonus scenario challenges you to solve this in 22 lines of code. There are shorter solutions, but if you're at 22 lines, you've done a good job of optimising.

Have fun!
