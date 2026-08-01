---
title: "彩虹"
description: "用 100 條彩色的垂直長條畫出一道彩虹。"
en_md5: 18cf1d57b1f3683a4484b507528f9acb
---

你的任務是用 100 條垂直長條製作出美麗的彩虹圖案。它看起來應該像這樣：

<img src="/static/images/exercise-assets/rainbow/example.webp" alt="彩虹" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

這道彩虹由`100`條長條組成，每一條都從上延伸到下，寬度為`1`。第一條長條的`x`（X 座標）應該是`0`，而最後一條長條的`x`應該是`99`。

要設定顏色，請使用`hsl(...)`（色相、飽和度與亮度）函式。這個函式會回傳（英語：_returns_）一個顏色字串，接著你就可以把它當作`rectangle(...)`（矩形）的最後一個輸入。將飽和度（英語：_saturation_）和亮度（英語：_lightness_）的值設定在`50`左右可能是最合適的。第一條長條的**色相（英語：*hue*）**應該是`0`。每一條長條的色相都應該逐漸增加，最後一條大約會落在 300 左右。
