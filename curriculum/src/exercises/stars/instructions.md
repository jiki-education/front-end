---
title: "Stars"
description: "Build and draw a pyramid of stars."
---

In this exercise you're going to build a visual pattern generator that draws rows of stars.

Your job is to create a function called <define>`layoutStars`</define> that takes one input, `numRows`, which specifies how many rows are needed, and then draws the various rows of stars.

The function should:

1. Build an array of strings - one string per row. Start from the bottom with the longest row first. For example, where `numRows` is `3`, that array would be `["***", "**", "*"]`.
2. Use the <literal>`drawStars(rows)`</literal> function, passing in your rows, which will draw the stars.

If `numRows` is 0, the array should be empty (`[]`) and nothing is drawn.

If you want to see things in action, you can run `drawStars(["***", "**", "*"])` to see the stars draw.

### The push method

As in the last exercise, you'll need to build your array up using the `.push(element)` method. In this exercise, you can only create one new array (`let something = []`) in your code.

Have fun!
