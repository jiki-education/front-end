---
title: "Adventures in Poetry"
description: "Walk a path collecting the words of a poem, ignoring everything that isn't one."
---

A poet is out for a walk, and the path ahead is scattered with the words of a poem.

Each square holds one of four things. Most hold a **word** of the poem. Some are **bare grass**, with nothing on them at all. Some have a bit of **scenery** growing on them, like a leaf or a butterfly. And one square, somewhere ahead, holds a **checkered flag**.

You have a <literal>`move()`</literal> function, which walks the poet forward onto the next square and **gives back** whatever was on it. You also have an <literal>`isEmoji(thing)`</literal> function, which gives back `true` if the thing you pass it is an emoji, and a <literal>`recite(poem)`</literal> function, which makes the poet say a poem out loud.

Your job is to walk the path, build up the poem, and then recite it.

## The rules

- **Words** go into the poem, with a space between each one.
- **Bare grass** and **scenery** are not part of the poem.
- An **apostrophe** sits on its own square, and it joins the words on either side of it. `heart` then `'` then `s` becomes `heart's`.
- A **comma** also sits on its own square. It sticks to the word before it, but there is still a space after it.
- The poet stops walking when they reach the **checkered flag**, or as soon as they have collected **seven words**. Whichever happens first.
- Whenever the poet stops, and however they stopped, they recite what they collected. You may only call <literal>`recite()`</literal> **once**.

## One restriction

You have been solving problems like this with `&&` and `||`, but **neither is allowed in this exercise**. There is another way to handle a square you don't want, and this exercise is about finding it.

Don't write any functions of your own either. One walk, from top to bottom.
