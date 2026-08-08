---
title: "天气符号"
description: "根据一系列描述绘制六天天气预报。"
en_md5: 18bc1bf16ffc94d81bfa81a93faa9a7f
---

有人请你制作一份六天的天气预报。然而，你收到的不是传统的气象数据，你的老板根据自己的感受来描述天气（例如“Snowboarding time! 🏂”或“Miserable 😩”）。

你拿到了一个包含六条天气描述的数组（英语：_array_），每天一条，你的任务是将每天的天气绘制到各自的盒子中。

天气预报显示为一个由六个盒子组成的网格，每个盒子对应从周一到周六的一个工作日。描述按顺序排列：第一个（盒子 `0`）是周一的天气，第二个（盒子 `1`）是周二的，依此类推，直到周六（盒子 `5`）。（你的老板周日不出门，所以他不关心天气，因此我们永远没法报道那天的天气……）

## 绘制每一天

我们为你提供了一个 `draw`（绘制）函数，它会为你完成所有的绘图工作。你的任务是确定要传入的正确元素。

```js
draw(box, day, elements)
```

- `box` 是要绘制的盒子（`0` 到 `5`）。
- `day` 是要标注到盒子上的星期几，例如 `"Monday"`。
- `elements` 是要显示的天气符号的数组（详见下文）。

一周的日期按顺序是：`"Monday"`、`"Tuesday"`、`"Wednesday"`、`"Thursday"`、`"Friday"` 和 `"Saturday"`。

因此，如果第一天是 `"Exciting 🤩"`，你会写：

```js
draw(0, "Monday", ["cloud", "snow"])
```

## 每种描述的含义

每种描述都对应一个特定的符号数组：

- `"Sunny ☀️"`: `["sun"]`
- `"Dull 😴"`: `["cloud"]`
- `"Miserable 😩"`: `["cloud", "rain"]`
- `"Hopeful 🤞"`: `["sun", "cloud"]`
- `"Rainbow territory! 🌈"`: `["sun", "cloud", "rain"]`
- `"Exciting 🤩"`: `["cloud", "snow"]`
- `"Snowboarding time! 🏂"`: `["sun", "cloud", "snow"]`

## 你的任务

逐个遍历 `days` 列表。对于每个描述，将其转换为正确的符号列表，并用对应的星期几标注，然后 `draw` 到对应日期的盒子中。
