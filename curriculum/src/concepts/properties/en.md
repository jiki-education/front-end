---
title: "Properties"
description: "Static facts about a value, accessed with dot notation and no brackets, like `.length` to find how many letters a string has."
---

So far, when we've thought about strings or numbers, we've thought of them as quite static things.

And while they are, they also have lots of functionality built into them that Jiki can use.

There are two types of abilities we're gonna look at, properties and methods.

Properties are facts that we can ask Jiki to tell us about things. So for example, strings have a property called `length`, which Jiki can use to tell us how long a string is.

So rather than having to loop over all the letters to work out how big a string is, we can just ask Jiki to tell us.

And to do this, we use a new form of syntax, a dot.

For example, if we have the string Jeremy and we want to get its length, we can write `"Jeremy".length`, and that's it.

```javascript
"Jeremy".length;
```

When Jiki creates a string, he counts the letters and just sort of writes a number in the corner with how many there are.

<img
  class="concept-image"
  src="/static/images/concept-assets/properties/jiki-counting-letters.webp"
  alt="Jiki counting the letters of the string Jeremy and writing the number in the corner"
/>

And then when we use the length property, Jiki just goes and checks what that number was. So in our `"Jeremy".length` example, when Jiki creates the string Jeremy, he counts the letters, writes the number six in the corner, and then when we write `"Jeremy".length`, he goes and checks it. So you can think of properties as being like facts about that thing.
