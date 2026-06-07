---
title: "Dictionaries"
description: "A spiral notebook page where each entry has a key on the left and its value on the right, giving you labelled data instead of a list."
---

Arrays are our go-to choice when we have a list of anything, a list of mentors, list of scores, list of ingredients, any list, you want to use an array.

But there's another data structure that's also really common for when you want something a bit more complex than a list.

Imagine we want to store some information about me, my name, my age, where I was born. You could use an array for it, but it's not really clear what's going on when you do.

Is England where I was born or where I live? Is 42 my age or something else?

And if I want to use this, I have to remember that the first position is for name, the second is for age, the third is for birthplace. It's all a bit messy, and it's messy because this isn't really a list of things. It's more complex than that. And that's where dictionaries come in. A dictionary is a new type of data structure. It's your fifth one. You've got strings, numbers, Booleans, arrays, and now dictionaries.

And I want you to think of a dictionary as a sheet of a spiral notepad.

On the left-hand side, you've got the headings, the words name, age, birthplace, and we call those keys.

And on the right-hand side, next to each heading, you've got the actual data, Jeremy, 42, England, and we call these values.

Just like arrays, a dictionary is one thing. It's one page from a notebook. And just like arrays, Jiki can put it in a variable, in a box, or as an input for a function, or he can get a dictionary out of the return chute. So here's what a dictionary looks like in code. We use curly braces to signify the start and the end, and then inside you've got pairs, a key on the left, a colon, and then the value on the right. And we have a comma between each pair. So Jiki sees this and he gets out his spiral notebook. He writes name, Jeremy, age, 42, and so on for each pair.

And when he's done, he tears off the sheet and puts that in a box labeled person.

There's a few rules to know. Keys are always strings. They must have quotes around them, and each key must be unique. You can't have two keys called name in the same dictionary.

The values can be the same if you want, but the keys have to be different.

And the values can be anything. They can be strings, numbers, Booleans, arrays, or even other dictionaries.

You can also have an empty dictionary, just like we had an empty array, and we can start with that and build on it later.

So you've got a dictionary, but how do you get something back out of it?

We use the same square bracket syntax as we did with arrays and strings, but instead of a position number, we put in a key.

So if we want to get someone's name out of a dictionary, we write the variable, person, square brackets, and then the key, in this case, name, in quotes inside.

And that tells Jiki to look in the person dictionary, find the key for name, and to get out its value. Jiki goes to the person box, takes out the page from the notebook, scans through all the keys until he finds name, and then reads off the value, Jeremy, and puts it in a new box called name.

Square brackets always mean the same things. You're reaching into something and getting something out. With arrays and strings, you use a number to say which position you wanna get something from. With dictionaries, you use a string for the key.

It's the same idea, just slightly different syntax.
