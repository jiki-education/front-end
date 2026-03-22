---
title: "CityScape: Skyline"
description: "Build a whole city skyline of random buildings."
---

Create a city skyline with multiple buildings of random heights!

You have four functions:

- `buildWall(x, y)` places a wall block at grid position (x, y)
- `buildGlass(x, y)` places a glass panel at grid position (x, y)
- `buildEntrance(x, y)` places an entrance door at grid position (x, y)
- `numBuildings()` returns how many buildings to construct

Each building is **5 columns wide**. The buildings are placed side by side starting at x=1.

For each building:

1. Choose a random number of upper floors (0 to 6)
2. Build the **ground floor** at y=1: wall, glass, entrance, glass, wall
3. Build the **upper floors**: wall, glass, glass, glass, wall
4. Build the **roof**: wall, wall, wall, wall, wall
5. Move x along by 5 for the next building
