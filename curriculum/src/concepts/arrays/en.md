---
title: "Arrays"
description: "An ordered chain of elements — strings, numbers, booleans, or anything else — held together as one value Jiki can pass around."
---

You've been using numbers and strings and Booleans, the posh word for true and false, and we call these different data types. Now we're adding our first compound data type.

That's a data type that can contain multiple things, not just one thing, and this data type is called an array.

When you hear the word array, I want you to think of a physical chain holding lots of things together.

Those things that it's holding can be anything, strings, numbers, Booleans, even other arrays, even things you've not yet learnt about, but let's not worry about that for now.

Everything in this chain is in order, the order in which they're chained together.

So an array contains lots of things, but it's one solid element, one solid thing, one array with lots of elements inside of it.

Jiki can take that array, that chain, and put it in a box, just like he can put a string in a box or a number in a box.

He can put it into an input slot of a machine. He can pull it out of a return chute. This array is one thing, and Jiki works with it in exactly the same way he works with strings, numbers, everything else you've seen so far.

Now, in code, an array looks a little bit like a chain, too. It has a square bracket on each end and then lots of items that are chained together, separated by commas.

So for example, if we wanted to create an array with the names of some of our bootcamp members, we could put together a box called mentors and put that chain inside of it.

We would write `let mentors =`, exactly the same as we do with any other box, and then we'd have an opening square bracket, lots of elements, their names separated by commas, and then a closing square bracket. When Jiki sees this, he goes and gets four pieces of paper, one for each name, then gets a new chain and chains them all together, and then he puts that chain in the mentors box.

You can put anything in an array, strings, numbers, Booleans, even a mix of things.

These are all different examples of totally valid arrays.

You can also create an empty array. It's just a chain with no elements. It's still a real thing. It's still got both its ends. It's still a chain. It's just that it's got no items inside of it. But you can still put this empty array inside a box and get it out and use it later.

So you can create an array using the square bracket syntax, but how do we actually use these? How do we check what's inside of them and get things out? Well, exactly the same way we did when we wanted to get letters out of a string. We can use the square bracket syntax with numbers inside.

So let's go back to our list of mentors. If we want to get the first out, we write `mentors[0]`. Remember that we count from zero in JavaScript.

And we can also iterate through an array in exactly the same way we iterated through strings before, using `for-of`.

Arrays work in exactly the same way. The only difference is this time, rather than getting a letter out, we're getting whatever the item in the array was. In this example, the name of the mentor.

So the first time we thank someone, we thank DJ. The second time, we thank Becky, et cetera.

We can also use the length property on arrays, just like we learned about on strings. If we have an array with four strings in the mentors box and write `mentors.length`, it'll return four.

And we can use includes exactly the same on arrays, too. We can say `mentors.includes("DJ")`, and it'll return true. But if we say `mentors.includes("Frank")`, it'll return false.

Everything works exactly the same as strings. It's just that we're working with the elements of an array, not the letters of a string.
