---
title: "Guest List"
description: "Count how many people in the queue aren't on the guest list."
---

You're a bouncer at the Oscars. There's a queue of hopefuls outside, and the guest list is in your hand. A lot of the queue is chancing it.

Before you open the doors, the organisers want to know how bad it is. Of the people currently queueing, how many aren't invited at all?

Write a function called `numChancersInQueue`. The function has two inputs:

- The first is the queue, passed as a list of names (strings)
- The second is the guest list, also a list of names

You should return how many of the people in the queue are **not** on the guest list.

Anyone who's on the guest list but hasn't turned up yet isn't in the queue, so they're neither a guest you're counting nor a chancer. They're not your problem.
