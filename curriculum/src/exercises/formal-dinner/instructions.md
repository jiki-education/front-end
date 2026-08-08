---
title: "Formal Dinner"
description: "Look up which table a guest is seated at from the seating plan."
---

You're back in your side hustle as a bouncer. It's the evening after the After Party, and there's yet another shindig. This time it's a formal dinner, so tonight you're less "burly man on a door" and more "person with a clipboard and a nice waistcoat".

This definitely isn't the place to use **just** your first name. In fact it isn't the place to use your first name at all. Here, everyone goes by an <define>honorific</define> (Miss, Mr, Dr, etc) and their surname.

The organisers have handed you the seating plan as two separate lists. One holds the guests' full names. The other holds the name of the table each guest is sitting at (named after trees and flowers). As with "After Party", the two lists line up: the guest at position 3 in the first list sits at the table at position 3 in the second list.

So when Mr Pitt sweeps in, you need to work out that this is the "Brad Pitt" on your list, and then tell him which table he's on.

Write a function called <define info="looks up the table a guest is seated at">`tableFor`</define>. The function has three inputs:

- The first is the list of guests' full names, as strings
- The second is the list of table names, in the same order as the guests
- The third is the arriving guest, formatted as an honorific followed by their surname (e.g. "Mr Pitt")

Return the name of the table the guest is sitting at. If they're not on the seating plan at all, return the string <literal>`"No table found"`</literal> instead (no chancers here!).

The honorific is always exactly one word, and everything after it is the guest's surname. Most surnames are one word, but a few grand ones run to two.

Be careful, though. Plenty of surnames look a lot like other surnames.

### String/Array Methods & Properties

In addition to the `.length` property you learned about in the last exercise, there are four methods that you might find useful. There are lots of ways to solve this exercise, but these will get you to the shortest possible solution.

`"...".split(substring)` splits a string using another string. For example:

```js
`"Jeremy".split("e")`
// ["J", "r", "my"]
```

`[...].slice(start)` captures part of an array, starting at index `start` and continuing to the end of the array. The captured elements are copied into a NEW array, which is returned to you. In effect, this drops the first `start` elements. For example:

```js
["Jeremy", "Erik", "Aron", "DJ", "Glenn", "Isaac", "Bethany"].slice(2)
// ["Aron", "DJ", "Glenn", "Isaac", "Bethany"]
```

`[...].join(string)` joins together the elements of an array with the provided string. For example:

```js
["Jeremy", "Erik", "Aron", "DJ", "Glenn", "Isaac", "Bethany"].join(" likes ")
// Jeremy likes Erik likes Aron likes DJ likes Glenn likes Isaac likes Bethany
```

`"...".endsWith(string)` tells you whether a string finishes with another string. For example:

```js
"Jeremy".endsWith("emy")
// true

"Jeremy".endsWith("Jer")
// false
```
