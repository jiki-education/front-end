---
title: "Skyscraper"
description: "Build a skyscraper on the city grid."
---

This is the first of two exercises where you're going to be building skyscrapers.

In this exercise, your job is to build a single skyscraper in the middle of the scene. In each scenario the height of the skyscraper varies.

To determine how many floors to build, you have a `numFloors()` function that returns the total height of the building.

There are three different components you can use: wall (`W`), glass (`G`) and entrance (`E`). Check the functions below to see the functions to make these.

The floor closest to the ground (either the "ground floor" or "first floor" depending on your geography!) always has an entrance sandwiched between two glass segments and two outer wall segments (`WGEGW`). The other floors have three glass sandwiched with walls (`WGGGW`). And on top of the floors is a roof (`WWWWW`).

So a 5 floor skyscraper has one entrance floor, 4 glass floors, and a roof. It should look like:

```
WWWWW
WGGGW
WGGGW
WGGGW
WGGGW
WGEGW
```

The center of the skyscraper should be at column `19`. The ground floor starts at `2` (just above the concrete floor) and goes upwards (so in our example above, that would be an entrance floor at `2` and a roof at `7`).

One key rule in this exercise is that all the values that you input into the functions must be either variables or formulas. You can't just input a number like `20`.

Once you finish this exercise, you'll unlock a Project where you'll build whole city skylines with different numbers of buildings with different widths.
