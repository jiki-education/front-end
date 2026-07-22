---
title: "Skyline"
description: "Build a whole city skyline of random buildings."
---

In the Skyscraper exercise you created a single skyscraper of different heights. This time we're taking it further, creating a skyline of buildings of different heights and different widths.

You have a function `numBuildings()`, which tells you how many buildings you need to create for that scenario. You then have functions `randomWidth()` and `randomNumFloors()`. You should use these to determine the widths and number of floors of each building in that scenario. The first time you use the functions give you the values for the first building, etc.

The buildings start with a `1` column gap to the left, and they have a `1` column gap between them.

So if you had a scenario with `numBuildings()` returning `2`, and `randomWidth()` returning `5` then `7`, and `randomNumFloors()` returning `4` then `8`, you'd get this layout (where `xxxxx` is the concrete floor)

```
       WWWWWWW
       WGGGGGW
       WGGGGGW
       WGGGGGW
 WWWWW WGGGGGW
 WGGGW WGGGGGW
 WGGGW WGGGGGW
 WGGGW WGGGGGW
 WGEGW WGGEGGW
xxxxxxxxxxxxxxxxxxxxxxx
```
