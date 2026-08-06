---
title: "条纹织物"
description: "通过正确选择每条条纹的颜色，编织出条纹图案。"
en_md5: ba93b39f1883d50139d243a16e3c204f
---

你正在设计一个算法来制作一卷条纹织物，它看起来应该是这样的：

<svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="二十条竖条纹：两端为紫色，中间依次排列着绿色、蓝色和黄色条纹" style="width: 200px; height: 200px; display: block; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;padding:4px;margin-top:-8px">
  <rect x="0" y="0" width="5" height="100" fill="#A020F0" />
  <rect x="5" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="10" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="15" y="0" width="5" height="100" fill="#008000" />
  <rect x="20" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="25" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="30" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="35" y="0" width="5" height="100" fill="#008000" />
  <rect x="40" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="45" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="50" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="55" y="0" width="5" height="100" fill="#008000" />
  <rect x="60" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="65" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="70" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="75" y="0" width="5" height="100" fill="#008000" />
  <rect x="80" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="85" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="90" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="95" y="0" width="5" height="100" fill="#A020F0" />
</svg>

这个图案是重复序列 `"yellow"`、`"blue"`、`"yellow"`、`"green"`。第一条和最后一条条纹是 `"purple"`。

你设计的画布宽 `100`，高 `100`。你需要画 `20` 条条纹，每条宽 `5`。

### 练习规则

你无法只写 20 个矩形语句就解决这个练习。你的代码应该能扩展到任意尺寸的织物。实际上，你的代码里只能使用一次 `rectangle(...)`（绘制矩形）函数！

相反，你需要循环，并使用我们上一节视频课中学到的求余（英语：remainder）运算符（英语：operator）。请仔细思考语句的顺序——这是成功完成这个练习的关键。

慢慢来，玩得开心！
