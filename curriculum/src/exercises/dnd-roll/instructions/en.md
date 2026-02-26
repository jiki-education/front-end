---
title: "D&D Roll"
description: ""
---

You've encountered a goblin in the dungeon! To fight it, you need to roll three dice, announce each result, then strike.

You have three functions:

- `roll(sides)` rolls a die with the given number of sides and **gives back** the result
- `announce(value)` announces a dice roll
- `strike(attack, damage)` strikes the goblin with your attack roll and total damage

Here's what you need to do:

1. Roll a 20-sided die for your attack
2. Roll a 6-sided die for your base damage
3. Roll a 4-sided die for your bonus damage
4. Announce each of the three rolls
5. Add the base damage and bonus damage together
6. Strike the goblin with your attack roll and total damage

**Important:** Each time you call `roll()`, it gives back a different number. You need to store each result in a variable so you can use it later. You can't just call `roll()` again and expect the same number!
