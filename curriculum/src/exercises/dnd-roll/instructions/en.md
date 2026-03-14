---
title: "D&D Roll"
description: ""
---

You are creating a bot that can play Dungeons and Dragons (DnD). If you're not familiar with DnD, the basic premise is that you encounter lots of scenarios and roll dice to work out what happens. There are many different dice with different amounts of sides (not just the six-sided die you might be used to!)

One scenario you need to handle is encountering a goblin. In order to attack the goblin you need to:

- Generate an **attack score** by rolling a 20-sided die.
- Generate a **base damage score** by rolling a 12-sided die.
- Generate a **bonus damage score** by rolling a 10-sided die.
- Add the base damage and bonus damage together to get your **total damage**.
- Strike the goblin with your attack roll and total damage.

After each time you roll a die, you need to announce the number that you rolled to the other people you're playing with. If you try and strike without announcing the numbers, they might think you're cheating!

You have three functions you can use:

- `roll(sides)` rolls a die with the given number of sides. This function returns the result.
- `announce(value)` announces a dice roll.
- `strike(attack, damage)` strikes the goblin with your attack roll and total damage.

**Important:** Each time you call `roll()`, Jiki rolls a die and gets a different number. Don't expect that rolling the same die twice will give the same number each time.
