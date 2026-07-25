---
title: "Niche Named Party"
description: "Work out who's allowed into a very exclusive party."
---

Tonight's party is very exclusive - only people whose names start with a specific set of letters are allowed in!

Your job is to write a function called <define>`handleGuest`</define> that takes two inputs:

- `name` - the name of the person at the door
- `allowedPrefix` - the required starting letters for tonight's party

It should return `true` if the person is allowed in, and `false` if they should be turned away.

For example, if tonight's allowed prefix is `"S"`, then `"Sarah"` gets in (returns `true`) but `"Brad"` doesn't (returns `false`). If the allowed prefix is `"Brad"`, then `"Bradley"` gets in but `"Brian"` doesn't.
