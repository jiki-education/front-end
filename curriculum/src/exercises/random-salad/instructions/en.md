---
title: "Random Salad"
description: ""
---

You and your partner can never agree on salad proportions — you want loads of leaves, they want extra croutons, neither of you can compromise. You've decided to let randomness settle it once and for all!

Use `Math.randomInt(min, max)` to generate a random amount of each ingredient, then make the salad.

`Math.randomInt(min, max)` gives back a random whole number between `min` and `max` (inclusive). For example, `Math.randomInt(1, 6)` gives back a number from 1 to 6, like rolling a die.

The ingredients and their ranges are:

- **Leaves**: between 20 and 100
- **Tomatoes**: between 5 and 20
- **Croutons**: between 10 and 50
- **Dressing**: between 1 and 10 spoonfuls

Generate a random value for each ingredient, store each in a variable, then call `makeSalad()` with all four values.
