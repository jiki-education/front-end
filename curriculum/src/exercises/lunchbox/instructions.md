---
title: "Lunchbox"
description: "Pack as many items as you can into a size-limited lunchbox."
---

As a kid, I'd pack my lunchbox every day for school. My mother would leave items out for me (neatly arranged from largest to smallest item) and I'd try and fit as much in the lunchbox as possible, but obviously it could only hold so much. Anything that didn't fit in, I'd have to put in my rucksack and carry around all day with me, rather than leaving it in my locker.

In this exercise, your job is to create an algorithm that works out what I can fit in the lunchbox and what I have to put in my rucksack.

Your job is to write a function called <define>`packLunch(items, capacity)`</define> that takes two inputs: the array of items (largest first), and the lunchbox's size <define>`capacity`</define> (a number).

The items array is a nested array - each item is also an array with two elements - the name of the item and its size. The items are always biggest to smallest. For example the array of items might be:

```javascript
[
  ["Water bottle", 20],
  ["Crisps", 10],
  ["Peanut Butter Sandwich", 8],
  ["Chocolate bar", 6],
  ["Satsuma", 3]
]
```

The lunchbox has a maximum capacity. You need to work out which items can go into the lunchbox. Fit in as many items as you possibly can. Everything else should go into the rucksack.

Your function should return an array that contains two elements. The first element is an array of the items for the lunchbox, and the second is the items for the rucksack. Both arrays should be ordered smallest to largest.

For example, for the array above, with a capacity of 20, you'd be expected to:

```javascript
return [
  ["Satsuma", "Chocolate bar", "Peanut Butter Sandwich"],
  ["Crisps", "Water bottle"]
]
```

### Methods to help

As with all the exercises in this section, you'll want to use the `.push(element)` method to build your arrays.

You also have a new method called `[...].toReversed()`, which creates a copy of an array with all the items reversed. For example:

```
["A", 1, true].toReversed()
// [true, 1, "A"]
```

You don't have to use it, but it might be useful.

Have fun!
