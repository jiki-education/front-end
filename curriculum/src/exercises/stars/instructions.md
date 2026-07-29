---
title: "Stars"
description: "Build and draw a pyramid of stars."
---

You're building a visual pattern generator to make rows of stars in a pyramid. For example, three rows would look like this:

```
   *
  * *
 * * *
```

Your job is to create a function called <define>`layoutStars`</define> that takes one input, `numRows`, and calculates, then draws, the various rows of stars.

The function should:

1. Build an array of strings where each string is a row of stars, one shorter than the row before it. For the pyramid above where `numRows` is `3`, that array would be `["***", "**", "*"]`.
2. Pass that array to <literal>drawStars</literal> to draw it. For example:

```javascript
let rows = ... // ["***", "**", "*"]
drawStars(rows)
```

If `numRows` is 0, the array is empty (`[]`) and nothing is drawn.

### The push method

As in the last exercise, you'll need to build your array up using the `.push(element)` method. In this exercise, you can only create one new array (`let something = []`) in your code.

Have fun!
