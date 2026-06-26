---
title: "Bouncer: Dress Code"
description: "Combine the person's outfit, age, and guest-list status to decide who gets in."
---

You're back to your side job as a bouncer, and tonight you're working at a venue with a strict dress code.

Your job is to check what the person is wearing alongside their age and decide what to do. You have some more "interesting" rules to follow.

### The rules

- Anyone in **formal** or **smart** clothes is let in and offered canapés.
- Adults (18 or over) in formal clothes also get offered champagne.
- Children (under 18) in any other clothes are allowed in only if they're on the guest list.
- Everyone else is turned away.

The dress code categories:

- **Formal** means `"ballgown"` or `"tuxedo"`
- **Smart** means `"suit"` or `"dress"`

### Your abilities

You have three functions to get data:

- `getOutfit()` returns the name of the outfit the person is wearing (e.g. `"ballgown"`, `"suit"`, `"denim"`)
- `getAge()` returns their age.
- `onGuestList()` returns whether they're on the guest list.

You are only allowed to use each of the "getting data" functions once in the solution (otherwise people are going to get annoying if you keep asking their name, etc!)

You then have some actions you can do:

- `offerChampagne()` offers the person a glass of champagne
- `offerCanapes()` offers the person some canapés (salmon tartare)
- `letIn()` lets the person into the venue
- `turnAway()` turns the person away

### Coding efficiently

There are lots of possible ways to solve this. Your aim is to piece all those rules together in a way that makes the code **clear to read**. Minimise duplication where possible.

Have fun and good luck!
