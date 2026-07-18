---
title: "Matching Socks"
description: ""
---

There's little in life more annoying than having odd socks where you can't find its partner. So one day you finally decide to sort those socks out!

You get all of the clean clothes from your drawers and put them into one basket. Then you go searching under every surface and behind every cushion to find any other clothes lying around, and put them in a second basket of dirty items.

You now have two baskets and want to go through, finding whether each sock has a pair or not.

Write a function called `matchingSocks`. It takes two inputs, the clean basket and the dirty basket - both as lists of strings. Return a list of all the pairs of socks.

For example:

- If the clean basket contains: `["left blue sock", "green sweater"]`
- And the dirty basket contains: `["blue shorts", "right blue sock", "left green sock"]`
- You should return `["blue socks"]`

The descriptions follow these rules:

- They are always lower case.
- They are always one or more words separated by spaces.
- For things that can be pairs, they will always start with `"left "` or `"right "`
