---
title: "String Concatenation"
description: "Adding strings together with `+` to glue fixed text and variables into one longer string."
---

You already know what strings are. They are pieces of paper with text on them.

So far, every string you've used is one that you've typed out directly. What happens if you want to build a string based on variables or conditions? How do we do that?

There are two ways.

The first is called <define>string concatenation</define>, which is a posh and slightly confusing way of saying adding two strings together.

Imagine you have two words, <define>`"hello"`</define> and <define>`"world"`</define>, and you want to create a string containing `"hello world"`.

You could just write out `"hello world"` as one string, but you could also write `"hello " + "world"`, and that would give you the same string.

Now, obviously, that's not all that useful in this scenario. But what if we had a variable with someone's name in and we wanted to say hello to them?

So imagine we have a variable called <define>`name`</define>, and it contains <define info="say 'the name Jeremy', or use name signifiers such as -san if appropriate in the language">`"Jeremy"`</define> sometimes and <define info="say 'the name Jiki', or use name signifiers such as -san if appropriate in the language">`"Jiki"`</define> other times. We want to say `"hello Jeremy"` or `"hello Jiki"` using that variable.

<img
  class="concept-image"
  src="/static/images/concept-assets/string-concatenation/jiki-name-box.webp"
  alt="Jiki holding a box labelled name, which can contain different values"
  width="207"
  height="400"
/>

Well, we can achieve this using this concatenation concept:

```javascript
"hello " + name // "hello Jeremy" or "hello Jiki"
```

That will give us either `"hello Jeremy"` or `"hello Jiki"` or hello anyone else, depending on what's inside the `name` box.
