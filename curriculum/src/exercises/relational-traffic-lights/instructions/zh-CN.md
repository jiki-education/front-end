---
title: "相对交通灯"
description: "重新构建你的交通灯，让所有部件随比例缩放。"
en_md5: d54633094a8d14f73b298fe4827504c4
---

你回来了，交通灯又来啦！这次，我们将沿用前两个练习的模式，构建一个交通灯，使得当我们调整半径时，它们能正确地按比例重新缩放。为此，我们有一系列变量，可以设置为与`center`（中心点）和/或`radius`（半径）相关。

<img src="/static/images/exercise-assets/relational-traffic-lights/target.webp" alt="目标交通灯示意图" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

### 工作原理

- 画布的左上角是`0,0`，右下角是`100,100`。
- 颜色变量和`center`已经为你固定好了。`radius`预设为 10，但你可以尝试修改它。
- 你需要将所有位置和大小变量都推导为`radius`和/或`center`的组合。
- 外壳是一个包围三盏灯的矩形，带有内边距。内边距的大小等于半径。
- 三盏灯在外壳内部垂直方向上均匀分布，而外壳位于图像的正中央。（因此，黄色圆形的中心就是图像的中心。）

### 需要推导的变量

所有这些变量都应该用到`radius`或`center`（比如 `radius * 7` 或 `center - (radius * 2)` 这样的公式）。

- `redY`（红色灯的垂直中心）、`yellowY`（黄色灯的垂直中心）、`greenY`（绿色灯的垂直中心）分别表示每盏灯的垂直中心位置。
- `housingX`（外壳左上角的X坐标）、`housingY`（外壳左上角的Y坐标）指定了外壳矩形左上角的坐标。
- `housingWidth`（外壳宽度）和`housingHeight`（外壳高度）是外壳矩形的尺寸。

### 测试响应性

在编写代码时，你可以将半径在 `2` 到 `12` 之间进行调整，看看一切是否正确地缩放。如果你的代码正确，你应该会看到所有部件围绕图像中心优美地缩放！
