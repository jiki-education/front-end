---
title: "Building Arrays"
description: "Starting with an empty array and using `push` to add items one at a time as you loop through data."
---

So far you've been working with arrays where their value is just set at the start and fixed. But what about if you want to add things to an array over time? Well, for this, arrays have a method called <define>`push`</define>.

Push has one input, the thing that you want to attach to the end of the array. So in this case, we're wanting to push the word `"Isaac"` onto the end of an array that already contains `"DJ"` and `"Bethany"`.

So to do this, Jiki takes the array out the box, he attaches `"Isaac"` onto the end of the chain, and then puts the whole thing back in the box. Note that unlike before with strings, where Jiki created a new string each time, he's actually changing the array here.

One pattern you'll see a lot in coding is starting with an empty array and building it up. You can imagine we've got a big list of names and we want to work through them. Every time we find one that's a mentor, add it to our array.

This looping and adding pattern is something you'll use a lot.
