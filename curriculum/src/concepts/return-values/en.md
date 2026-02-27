---
title: "Return Values"
description: "Functions that give information back to you after doing their work."
---

Some functions don't just do something in the world — they give you something back to use in your code. When a function gives something back, we say that the function **returns** something.

You can think of these machines as having an output chute. We already have our input slots that we put things into, but some machines also have an output chute that something comes back out of. When Jiki presses the button, the machine whirs away, and something pops out of the chute. It could be a number, it could be a string — it's something Jiki can catch and use.

Most functions return something. They might do some maths and return the result, or glue some strings together and give you the resulting string, or give you back the current time.

For example, imagine a function called `getCurrentTime`. Every time Jiki runs the machine, a piece of paper slides out the chute with the time written on it. You can store that returned value in a box using `let`:

```js
let time = getCurrentTime();
```

Jiki runs the machine, catches the time from the chute, and stores it in a box called `time`.

It's important to understand that the value in the box is fixed at that moment. Even if the actual time changes while your program is running, the box still has the original value in it. If you want the current time again later, you need to run the function again.

Most functions that return things also have inputs. For example, a `join` function might take two strings and return them joined together with a space:

```js
let greeting = join("hello", "world");
// -> "hello world"
```

Out the chute comes a single string: `"hello world"`.

You'll often see a comment under a function like `// -> "hello world"`. This is someone indicating what the function will return.
