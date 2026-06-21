---
title: "String Templates"
description: "Using backticks and `${...}` placeholders to slot values straight into a string instead of joining pieces with `+`."
---

We can use something called template literals to insert strings into other strings.

So rather than adding strings together, we can have a string or template that has spaces for other strings inside of it.

To do this, we use backticks instead of quotes.

Backticks are backward ticks, as the name suggests, but you might well have never used them before, so you need to find the right key on your keyboard.

We use them to create a template that can contain other strings. And then to insert a string into the template, we use another weird syntax of dollars and braces. So for example, to achieve the same `"hello " + name` thing we just saw with concatenation, we could write `` `hello ${name}` ``.

```javascript
`hello ${name}`;
```

<img
  class="concept-image"
  src="/static/images/concept-assets/string-templates/jiki-name-box.webp"
  alt="Jiki holding a box labelled name, the value that gets slotted into the template"
/>

That looks a lot better than it sounds when I say it.

And that's doing exactly the same thing as adding the strings together.

But when you have multiple strings that need all piecing into one place, this can be a lot more efficient.

It will take you a little bit of time to get used to this exact syntax, but there's nothing really that complex about it.
