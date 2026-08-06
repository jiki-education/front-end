---
title: "狐狸脸"
description: "用彩色三角形构建几何风格的狐狸脸。"
en_md5: 095833a5b2117c2d26500103216bf247
---

本练习向你介绍 `triangle`（三角形）函数。你需要为它提供 7 个输入。前 6 个输入是三个角点的坐标对，最后一个输入是 `color`（颜色）：

- `x1`（第一个角的 x 坐标）、`y1`（第一个角的 y 坐标）：第一个角点
- `x2`（第二个角的 x 坐标）、`y2`（第二个角的 y 坐标）：第二个角点
- `x3`（第三个角的 x 坐标）、`y3`（第三个角的 y 坐标）：第三个角点
- `color`（颜色）：三角形的颜色（例如 `"orange"`）

<img src="/static/images/exercise-assets/foxy-face/intro-triangle.webp" alt="三角形函数示意图" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

### 绘制狐狸脸

你的任务是使用三角形来构建一个几何风格的狐狸脸：

<img src="/static/images/exercise-assets/foxy-face/example.svg" alt="狐狸脸" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

这张脸左右对称（左侧和右侧完全一样），总共由 8 个三角形组成：

- 两片 `"white"` 面颊
- 两只 `"brown"` 耳朵
- 两半 `"orange"` 脸
- 一个 `"charcoal"` 鼻子（由两个三角形组成）

（绘制三角形时，请务必使用这些颜色，并且记住要把它们写成字符串（英语：string）！）

我们已经为你画出了某些部分的轮廓，帮助你入门。如果你按照注释中的顺序来操作，会发现事情会变得稍微轻松一些。

另外，为了再给你减轻点负担，这里用到的所有数字都能被 5 整除（例如 `5`、`10`、`15` 等是有效的，而 `1`、`2`、`3`、`4`、`6`、`7`、`8`、`9`、`11` 等则不行）。在后面的练习里你会反复见到这一规律。

最后还有一件事。你可以将鼠标悬停在画布区域上来找到坐标。这对左侧的绘制很有用，但右侧既然对称，你能在不靠悬停的情况下把它也画出来吗？

祝你好运！
