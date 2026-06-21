---
title: "String Indexing"
description: "Using square brackets and a position number to pull out a single letter from a string. Remember that positions start at zero."
---

Imagine you have my name, Jeremy, and you want to get my initial J out of that. How would we go about doing it?

<img
  class="concept-image"
  src="/static/images/concept-assets/string-indexing/jiki-thinking.webp"
  alt="Jiki thinking about how to pull a single letter out of a string"
  width="361"
  height="353"
/>

Well, you can think of a string as being a series of letters. So Jeremy has six letters, J-E-R-E-M-Y, and each one has a position. J is in the first position, Y is in the last position.

Now, in JavaScript and most programming languages, these positions start at zero. So the first letter J is at position zero, and then next we have E, which is at position one, R at two, E at three, M at four, and Y at five.

Now, this starting with zero thing is pretty weird, and honestly, life would be easier if we just started counting from one, like in the normal world.

But we don't. In most programming languages, we start counting from zero instead, so you just need to learn that.

So if we want to get a letter at a specific position, we can use square brackets with the number inside.

So if we say `"Jeremy"[0]`, we're saying give me the first letter of the word Jeremy.

If we say `"Jeremy"[1]`, we're saying give me the second letter.

```javascript
"Jeremy"[0]
"Jeremy"[1]
```

And we can do this with variables too. So if we make a variable called name and set its value to the string Jeremy, then we can do `name[0]`, and we'll get J again.

```javascript
let name = "Jeremy"
name[0]
```

One thing to be clear on, what you get back from `name[0]` is just another string. It's another piece of paper with J on it. There's nothing special about it. It's a string just like Jeremy is a string.

<img
  class="concept-image"
  src="/static/images/concept-assets/string-indexing/jiki-holding-j.webp"
  alt="Jiki holding a fresh piece of paper with just the letter J on it"
  width="500"
  height="289"
/>

It just happens to have one letter on it instead of six.

And doing this doesn't affect the original string at all. We're not, like, ripping the J off or anything. We're just finding which of the letters we want, and then making a new string with that in.
