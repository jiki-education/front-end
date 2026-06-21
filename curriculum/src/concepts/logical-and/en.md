---
title: "The `and` keyword"
description: "Combining two conditions with `&&` so the whole condition is only true when both parts are true."
---

If I asked you to open the door only if somebody was over the age of 20, you'd probably know what to do. But what about if you needed to check whether someone is over 20 _and_ wearing the correct outfit? So you need to check two different conditions at once. How would you do that?

Maybe you could have a nested if statement, a bit like we had nested loops before. So you could say, if age is greater than 20, then we go into this code block, and then another if outfit equals disco, and another curly brace and a new code block. That would work, but it gets pretty messy, especially when you want to have lots of conditionals.

Thankfully, there's an easier way, and that's to be able to have conditions that have multiple parts. Rather than just checking one thing in the condition, we can check two or three or more things. And to do this, we need to use the `and` keyword. Now, sadly, in JavaScript, the and keyword isn't actually the word and, which it is in some languages. Instead, you have to have two ampersands next to each other. You're just gonna have to remember this. It's annoying, but it is what it is, and you'll get used to it.

So we can use this to make a more complex condition. We can say if age is greater than 20 and the outfit is disco, then we're gonna continue. If the age is less than 20 or the outfit isn't disco, then the whole statement, the whole condition is false. If you've ever studied logic, maybe you've made some electronics or you've done some more advanced maths, then this will feel very natural to you. If not, you'll pick it up quickly.

```javascript
if (age > 20 && outfit === "disco") {
  openDoor();
}
```

There's one thing that trips people up with both and and or, and that's that each side of the and/or needs to be a complete comparison. So even if you're comparing the same variable on both sides, you have to repeat it. You can't write `if age is greater than 13 and less than 20`. You have to write `if age is greater than 13 and age is less than 20`. You need both sides to be complete comparisons.

```javascript
if (age > 13 && age < 20)
```
