---
title: "Meal Prep"
description: "Work out which ingredients you need to buy for your recipe."
---

You're the sort of person that likes to pop to the shops each day to get whatever ingredients you need for dinner. It gives you a nice excuse to stretch your legs and chat to the local shopkeeper.

Each day you choose a recipe, then check what's in the fridge, and note down what you need to buy.

Now you've decided to make your life a little easier, by writing a program to do the hard work for you! It checks what's on your list, against what's in the fridge and outputs the difference.

Your job is to write a function called <define>`shoppingList(fridgeContents, recipeItems)`</define>. It takes two inputs: the contents of your fridge as an array of strings, and the items in the recipe, also as an array of strings. It should return the things you need to buy, as an array of strings.

For example:

```javascript
let fridgeContents = ["tomatoes", "leaves", "milk"]
let recipeItems = ["beef", "tomatoes", "peppers"]

shoppingList(fridgeContents, recipeItems)
// ["beef", "peppers"]
```

### The push method

To solve the exercise you need to build your array up using the `.push(element)` method. You can only create one new array in your code. Watch the previous video again if you're unsure what to do.

You might also like to use the `includes` method too (see below for a reminder).

Have fun!
