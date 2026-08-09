---
title: "After Party"
description: "Look up how many guests a celebrity is allowed to bring, using two lists that line up."
---

We're back to playing the role of a bouncer. But this time, we're dealing with A-List Celebrities at the After Party.

When these people show up to your party, they expect you to know them just by their first-names. Brad Pitt isn't going to waste his breath telling you his surname, he'll just say "Brad", and then look at you like you're the one being awkward.

Tonight there are two lists on your clipboard. The first is `names`, the full names of everyone invited. The second is `plusOnes`, how many extra people each of those guests is allowed to bring in with them (their <define info="the extra guests someone is allowed to bring along">"plus-ones"</define>). The two lists were written out together, entry by entry, in the same order, so they line up. For example, the third entry of the names list corresponds to the same person as the third entry of the plusOnes list.

Write a function called <define>`plusOnesFor`</define>. The function has three inputs: the `names` list, the `plusOnes` list, and the **first name** of whoever is stood in front of you right now. You should return the number of extra guests that person is allowed to bring in.

Be careful, though. There's a queue forming, and these people do not queue quietly. "Brad" means Brad Pitt, not Bradley Cooper. And one or two of them are famous enough to have dropped their surname altogether.

Some guests are invited but aren't allowed to bring anyone with them, so `0` is a perfectly good answer for a name that's on the list. Someone who isn't on the list at all is a different matter entirely, and for them you should return the string <literal>`"Not on the list!"`</literal>, exactly as written.

### Array Methods & Properties

Just like strings, arrays also have methods and properties. In this exercise you might like to use the `.length` property. It works exactly the same as the string version, except now it tells you how many elements are in the array, rather than how many letters are in the string. For example:

```js
["Jeremy", "Erik", "Aron"].length
// 3
```

Have fun!
