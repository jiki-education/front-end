---
title: "CityScape: Skyscraper"
description: ""
---

Build a skyscraper on the city grid!

You have four functions:

- `buildWall(x, y)` places a wall block at grid position (x, y)
- `buildGlass(x, y)` places a glass panel at grid position (x, y)
- `buildEntrance(x, y)` places an entrance door at grid position (x, y)
- `numFloors()` returns how many floors the building should have

The building is 5 columns wide (x=1 to x=5). Build it from the bottom up:

1. **Ground floor (y=1)**: wall, glass, entrance, glass, wall
2. **Upper floors**: wall, glass, glass, glass, wall (use `numFloors() - 1` to know how many)
3. **Roof (top row)**: wall, wall, wall, wall, wall

Use a variable and a loop for the upper floors!
