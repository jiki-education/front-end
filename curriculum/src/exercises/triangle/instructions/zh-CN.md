---
title: "三角形"
description: "判断三角形是等边、等腰、不等边还是无效三角形。"
en_md5: 15574e7bfbdfaffbd935bf6bba258e63
---

你需要创建一个函数，用来判断一个三角形是等边、等腰、不等边还是无效三角形。

### 三角形

- 一个 _equilateral_ 三角形的三条边长度都相等。
- 一个 _isosceles_ 三角形有两条边长度相等。
- 一个 _scalene_ 三角形的所有边长度都不相等。

要使三角形有效，需要满足：

- 所有边都必须大于 0
- 任意两边之和必须大于第三边。

### 函数

函数必须命名为 `determineTriangleType`（确定三角形类型）。它需要接收三个输入，也就是代表三角形三条边的数字。它必须返回 `"invalid"`、`"equilateral"`、`"isosceles"` 或 `"scalene"` 其中之一。
