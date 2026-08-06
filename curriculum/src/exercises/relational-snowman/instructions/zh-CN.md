---
title: "关联雪人"
description: "重建你的雪人，使所有尺寸都基于一个变量等比缩放。"
en_md5: 1753f8d873e9a5b58885cc1daee5ea5d
---

在本练习中，我们将再次搭建一个雪人。与上一练习类似，我们的目的是让所有部分都能通过算术运算从一个单一的 `size`（大小）变量推导出来。

根据你选择的 `size`，雪人应该会相应变大。

<img
  src="/static/images/exercise-assets/relational-snowman/sizes.webp"
  alt="大小为 1 到 5 时的雪人"
  style="width: 100%; max-width: 600px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;"
/>

### 工作原理

- 绘制画布的左上角为 `0,0`，右下角为 `100,100`。
- 你已经有一个预先写好的变量 `snowmanX`（雪人中心 x 坐标），表示图像的中心，以及一个可以变化的 `size` 变量，你可以将其从 `1` 改为 `5` 来让雪人变大。
- 你需要用算术表达式推导出所有其他变量。
- 头部的半径为 `size * 2`，身体的半径为 `size * 3`，底座的半径为 `size * 4`。
- 圆与圆之间应该彼此相切：身体直接位于底座之上，头部又直接位于身体之上。（相比之前的练习，这次的雪人稍微更不稳当一些——每个雪球都恰好放在下面的雪球上，彼此互不重叠融合。今天一定很冷！）
- 底座圆形的底部距离画布底部为 `size`。
- 你需要计算出所有三个雪球的圆心坐标。

### 变量

你的任务是按照上面的说明来设置这些变量。

- `headRadius`（头部半径）：从 `size` 推导
- `bodyRadius`（身体半径）：从 `size` 推导
- `baseRadius`（底座半径）：从 `size` 推导
- `baseY`（底座 y 坐标）：从 `size` 和 `baseRadius` 推导（底座位于地面）
- `bodyY`（身体 y 坐标）：从 `baseY`、`baseRadius` 和 `bodyRadius` 推导
- `headY`（头部 y 坐标）：从 `bodyY`、`bodyRadius` 和 `headRadius` 推导

### 玩玩看

你可以将 size 从 `1` 改为 `5`，雪人应该会变大。记得改动之后要点击“运行代码”。
