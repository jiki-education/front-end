---
title: "彩虹"
description: "用 100 根彩色竖条画出彩虹。"
en_md5: 18cf1d57b1f3683a4484b507528f9acb
---

你的任务是制作一个由 100 根竖条组成的美丽彩虹图案。看起来应像这样：

<img src="/static/images/exercise-assets/rainbow/example.webp" alt="彩虹" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

这彩虹由 `100` 根竖条组成，每根从上到下，宽度为 `1`。第一根的 `x`（x 坐标）应为 `0`，最后一根的 `x` 应为 `99`。

要设置颜色，请使用 `hsl(...)`（色相、饱和度、亮度函数）。`hsl(...)` 会返回（英语：_returns_）一个颜色字符串，然后你可以在 `rectangle(...)`（绘制矩形的函数）中将其作为最后一个输入参数。将饱和度（英语：_saturation_）和亮度（英语：_lightness_）的值设置成大约 `50` 可能最合适。第一条的**色相（英语：*hue*）**应为 `0`。每条竖条的色相应逐渐增加，最后结束时达到 300 左右。
