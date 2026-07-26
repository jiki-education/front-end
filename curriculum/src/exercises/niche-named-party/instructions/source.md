---
title: "Niche Named Party"
description: "Work out who's allowed into a very exclusive party."
---

Tonight's party is very exclusive - only people whose names start with a specific sequence of letters are allowed in!

Your job is to write a function called <define>`handleGuest`</define> that takes two inputs:

- `name` - the name of the person at the door
- `allowedPrefix` - the required starting letters for tonight's party

It should return `true` if the person is allowed in, and `false` if they should be turned away.

For example:

- If tonight's allowed prefix is `"S"`, then <literal>Sarah</literal> gets in (returns `true`) but <literal>Brad</literal> doesn't (returns `false`).
- If the allowed prefix is `"Brad"`, then <literal>Brad</literal> and <literal>Bradley</literal> get in but <literal>Brian</literal> doesn't.

### Helper functions

As you work through this exercise, you will find it neccesary to work out the length of the guest's name, and also the length of the allowed prefix. This is the perfect opportunity to create a helper function called `getLength(someString)`, which counts how many letters are in the string. You can then use this function in different places inside `handleGuest(...)`

The bonus scenario challenges you to solve this in the minimum number of lines possible. You might also come up with other solutions that you prefer, which use more lines. That's totally fine (and you're encouraged to explore different approaches), but try and find the shortest version too.

Have fun!
