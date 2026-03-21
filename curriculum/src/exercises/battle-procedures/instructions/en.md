---
title: "Battle Procedures"
description: "Extract your shooting logic into a reusable function."
---

In the last level, you learnt how to move a laser cannon back and forth, shooting down aliens. It worked, but the shooting logic was mixed in with everything else.

In this exercise, you'll extract the shooting logic into its own function called `shootIfAlienAbove`. This function should check if there's an alien above the laser cannon and shoot it if so.

The rest of the game logic (tracking position, changing direction at boundaries, moving the laser) stays in the loop as before.

Create your `shootIfAlienAbove` function, then use it inside the loop alongside the movement logic.
