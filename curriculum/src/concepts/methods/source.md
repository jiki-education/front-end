---
title: "Methods"
description: 'Functions that belong to a value and are called with dot notation, like `"Jeremy".includes("e")` or `"Jeremy".toUpperCase()`.'
---

So far, when we've thought about strings or numbers, we've thought of them as quite static things.

And while they are, they also have lots of functionality built into them that Jiki can use.

And as we move forward, we're gonna be learning about this functionality, about these sort of abilities that they have that make your life a lot easier.

There are two types of abilities we're gonna look at, <define>properties</define> and <define>methods</define>.

Methods are functions that belong to the string.

So rather than us writing a function that we put a string into as an input, we can use a method directly on the string.

For example, remember a function where you check whether a string has a particular letter inside of it? Well, strings actually have a method called <define>`includes`</define> that does that, and we can use it with the same dot syntax you saw for properties.

The difference from properties is that when we write these, we write them like functions with brackets and inputs.

So we can write `"Jeremy".includes("e")` and we'll get back `true`, as `"Jeremy"` has an `"e"` in it.

<img
  class="concept-image"
  src="/static/images/concept-assets/methods/jiki-writing-jeremy.webp"
  alt="Jiki writing the string Jeremy on a piece of paper"
  width="359"
  height="400"
/>

```javascript
"Jeremy".includes("e")
```

Methods are different to properties because they're not static facts. They're actually functions. You can think of them as like functions that have a built-in box with the string inside of it.

How they work doesn't really matter for now. You're not gonna be building them for a while. All you need to know is that you use a method by using a dot and then the normal function syntax.

One thing to know with strings is that the methods don't change anything inside the string. For example, there's a <define>`toUpperCase`</define> method, which returns the string with all the letters in uppercase. But that doesn't change the original string. That still contains `"Jeremy"` written with just a capital J. Instead, Jiki is creating a new string that's all uppercase.

```javascript
const name = "Jeremy"
const bigName = name.toUpperCase()

log(bigName)
log(name)
```
