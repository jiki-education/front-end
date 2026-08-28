---
title: "Sign Words"
description: "Break a business name into the individual words to be printed."
---

A while back you built a program to help a customer with their sign-making business. They've now come back and have a new requirement. They're now making bigger signs where they pre-print each word, and then assemble the words on the business's windows on site.

They need you to make the first step of the program for them - taking the name of the business and breaking it into words, which they can print.

Write a function called <define>`signWords(businessName)`</define> that takes the business's name and returns an array of the words in it. For example, `signWords("Frank's Hotdogs")` should return `["Frank's", "Hotdogs"]`.

Words are things separated by spaces. But one thing to be aware of... Sometimes customers send their business name over with multiple sequential spaces in the name by accident. If that happens, you need to ignore them, so <code>"Frank's&nbsp;&nbsp;&nbsp;Hotdogs"</code> should still return `["Frank's", "Hotdogs"]`

### Push and Split

The key to this exercise is to use the `push` method to build the array. You can also use the `split` method, but you may find it easier to manually do the work of splitting instead. Neither is right or wrong. If you need a reminder of how the methods work, check below.

Have fun!
