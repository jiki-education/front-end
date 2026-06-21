---
title: "Using Multiple Functions Together"
description: "Splitting a problem into small single-responsibility functions that call each other, so each piece stays simple and reusable."
---

So far, when you've written functions, each one has pretty much stood on its own feet and contained all of the logic it needs to work.

Now we're going to look at breaking functions up so that we have smaller functions that work together rather than big functions that have lots going on.

As a general rule in programming, you want each function to do the minimum it can. We call this a function having a single responsibility. Each function should just do one thing and use other functions for the different sub-parts of that.

So let's look at an example.

Imagine we have a function whose job it is to return a string that describes a name.

A simple version would look like this. We have a counting loop, something you've already written, and then a string template that pieces the result together.

```javascript
function describeName(name) {
  let length = 0;
  for (const letter in name) {
    length += 1;
  }
  return `This name is ${length} letters long`;
}
```

This works fine, but it's doing two things. It's doing one quite generic thing, counting, and another very specific thing, building out this string in a particular format.

It'd be much nicer to break this into two functions, one that's responsible for the counting and one that's responsible for describing a name in this particular format.

```javascript
// Just counts letters
function countLetters(str) {
  let count = 0;
  for (const letter in str) {
    count += 1;
  }
  return count;
}

// Just formats text nicely
function describeName(name) {
  const count = countLetters(name);
  return `The name has ${count} letters`;
}
```

And we can then reuse that generic counting function in this string formatting, but also in any other place we need. Whenever we need to count letters in a string, it's totally detached from anything to do with the printing.

You can read both functions in isolation and immediately understand what each of them do.

As your functions get more complex and you have more of them, this technique is the difference between having neat, readable code and just total confusion and mess.

There's one thing worth mentioning again here, and that's that anything you create inside a function can't be accessed by other functions unless you deliberately return it.

So if you try and reference the count variable from inside `describeName`, you can't do it, as it belongs to the other function.

<img
  class="concept-image"
  src="/static/images/concept-assets/function-composition/jiki-thinking.webp"
  alt="Jiki thinking, with a lightbulb above his head, about how variables stay private to each function"
/>

In JavaScript, we can create variables at the top above everything that are shared between functions, but I really recommend you don't do that unless there's a really good reason.

The more you keep each function independent, and the technical word for that is pure, pure functions, the cleaner your code will be and the less bugs that you're gonna create and have.
