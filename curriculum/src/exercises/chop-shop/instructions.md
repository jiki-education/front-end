---
title: "The Chop Shop"
description: "Work out if the barber has time for one more customer."
---

You run a small hairdressing salon that focusses on speed over quality. People might leave a little rough around the edges, but they're not having to spend too long in the chair.

You offer a few different services from styling to full haircuts, which take different times to complete. You run the salon on a first-come, first-serve basis. There's no appointment system.

As it gets towards the end of the day, you need a way of knowing if you have time for any new people that come into the shop.

Write a function called <define>`canFitIn`</define> which takes three inputs:

- The first is the haircuts that you have in the queue already (array of strings)
- The second is the haircut that the new person wants (string)
- The third is the amount of minutes left in the day (number)

Return a boolean for whether you can fit the person in.

The styles you offer are:

- Mohawk: 20 minutes
- Slicked-Back Pixie: 15 minutes
- Bob: 25 minutes
- Shave and Polish: 15 minutes
- Afro Trim: 45 minutes
- Up-do: 30 minutes

### Nested Arrays

This is the first exercise where you're dealing with an array that contains other arrays as elements. We call these "nested arrays". Nested arrays are the same as any other array, but rather than the array containing strings or numbers, they contain other arrays.

Take a look at the <define>`cuts`</define> array. It contains other arrays, one for each hair cut, and each of these arrays has two elements - a name and a duration.

It's easiest with this to think of the inner arrays - the pairs of names and durations, and then think of them all being grouped together in another array.

Indexing works the same as it does everywhere else, but you can chain indexes together like this...

```javascript
let cuts = [
  ["Mohawk", 20],
  ["Slicked-Back Pixie", 15],
  ["Bob", 25],
  //...
]

cuts[0] // ["Mohawk", 20]
cuts[0][0] // "Mohawk"
cuts[0][1] // 20
cuts[2][0] // "Bob"
```
