---
title: "Triangle"
description: "Classify a triangle as equilateral, isosceles or scalene."
---

Your task is to create a function that checks whether a triangle is equilateral, isosceles, scalene, or invalid.

### Triangles

- An _equilateral_ triangle has all three sides the same length.
- An _isosceles_ triangle has two sides the same length.
- A _scalene_ triangle has all sides of different lengths.

For a triangle to be valid:

- All sides have to be greater than 0
- If you add together any two sides, the total must be larger than the third side.

### The function

The function must be called `determineTriangleType`. It must take three inputs, which will be numbers for the three sides of the triangle. It must return one of `"invalid"`, `"equilateral"`, `"isosceles"` or `"scalene"`.
