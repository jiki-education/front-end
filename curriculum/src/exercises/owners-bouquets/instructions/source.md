---
title: "Owner's Bouquets"
description: "Plant flowers in different garden layouts."
---

Welcome to your second exercise with scenarios.

We're back with our automated gardening machine. Previously, we always planted 9 flowers, but now things are changing. We need our robot to be able to plant however many flowers its told to by the owner of the house.

To do this we've got a function called <define>`askNumberOfFlowers()`</define>. When we use it, we ask the owner of the house how many flowers to plant and the function returns a number with the answer. If the function returns 3, we have to plant 3 flowers. If it returns 8, we have to plant 8 flowers.

We are under strict instructions to keep the garden neat, so we need to plant the flowers evenly across the garden. If there are 3 flowers, we need to plant them at 25,50 and 75. If there are 4 flowers, we need to plant them at 20,40,60,80, etc. (As normal, the garden is 100 units wide).

### Scenarios

As in the golf exercise you just solved, on the left you'll see four grey dots for the four different scenarios. **Clicking on each dot** shows you a different scenario, but this time it's the `askNumberOfFlowers()` that will return a different number each time.

Your job is to write one program that works for all the different possible values `askNumberOfFlowers()` might return.

Good luck!
