---
title: "Adventures in Poetry"
description: "Walk a path collecting the words of a poem, ignoring everything that isn't one."
---

You're making a robotic poetry game called "Adventures in Poetry". As your first step, you need to program the robot so that as it walks, it collects words and then recites the poem at the end.

Each square holds one of four things:

1. Nothing (`""`)
2. A **word** from the poem.
3. Scenery like a leaf or a butterfly (an emoji).
4. A checkered flag, which tells the robot to stop.

To help you, you have a few functions. Firstly, you have a <literal>`move()`</literal> function, which tells the poetic robot to move forward onto the next square and returns whatever was on it. You have an <literal>`isEmoji(thing)`</literal> function, which returns a boolean telling you whether the string you pass in is an emoji. And finally you have a <literal>`recite(poem)`</literal> function, which you need to use with the final poem.

Your job is to walk the path, build up the poem, and then recite it.

## The rules

- **Words** go into the poem, with a **space between each one**.
- **Scenery** is not part of the poem and should be ignored.
- An **apostrophe** sits on its own square, and it joins the words on either side of it. `heart` then `'` then `s` becomes `heart's`.
- A **comma** also sits on its own square. It sticks to the word before it, but there is still a space after it.
- The poet stops walking when they reach the **checkered flag**, or as soon as they have collected **seven words**. Whichever happens first.
- Whenever the poet stops, and however they stopped, they recite what they collected. You may only call <literal>`recite()`</literal> **once**.

## Restrictions

There are lots of ways to solve this exercise, but to push you towards the `continue` and `break` keywords you recently learned, we have a few rules:

1. Your solution must use both `continue` and `break`.
2. You can't use `&&` or `!` in your solution.
3. You can't write any helper functions.
4. You're only allowed two levels of indentation, so this isn't allowed:

```javascript

// Allowed - 2 levels of indentation
repeat() {
  if(...) {
    //...
  }
}

// Not Allowed - 3 levels of indentation
repeat() {
  if(...) {
    if(...) {
    }
  }
}
```

Have fun!
