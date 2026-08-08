---
title: "棋盘"
description: "绘制任意大小的棋盘并为游戏做好准备，根据棋盘大小推算出所有位置。"
en_md5: 1669c45c882ce94e16651bfc2d77a172
---

在这个项目中，你将绘制一个棋盘并放上棋子，为跳棋（又称西洋跳棋）游戏做好准备。

你的代码需要适用于**任意大小的棋盘**。我们提供了三个样板棋盘供你尝试。一个谜题使用经典的 8x8 棋盘，另一个使用较小的 6x6，还有一个使用较大的 10x10。你可以使用 `getBoardSize()`（获取棋盘大小）来获知当前棋盘格子的宽度和高度（棋盘始终是正方形）。

<div style="display: flex; gap: 8px; margin: 12px 0;">
  <img src="/static/images/exercise-assets/checkerboard/board-6.svg" alt="6x6 棋盘" style="width: 33.333%; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);" />
  <img src="/static/images/exercise-assets/checkerboard/board-8.svg" alt="8x8 棋盘" style="width: 33.333%; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);" />
  <img src="/static/images/exercise-assets/checkerboard/board-10.svg" alt="10x10 棋盘" style="width: 33.333%; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);" />
</div>

### 棋盘

画布大小始终为 `100` 宽、`100` 高。请遵循以下两条规则：

- 棋盘外侧有一圈 `"black"` 颜色的边框，宽度为 `2`。
- 方格交替填上 `"dark brown"` 和 `"white"`，整齐地平分边框内部的空间。左下角的方格始终是 dark brown，不是 white。

### 棋子

- 每个棋子位于方格中心。
- 棋子是有楞的圆形，有外层边框和内层颜色：
  - 整个棋子的宽度是方格宽度的 80%。
  - 内层圆的宽度是整个棋子宽度的 75%。
- 棋盘**顶部**的行放 `"charcoal"` 色棋子（边框为 `"black"`）。
- 棋盘**底部**的行放 `"white"` 色棋子（边框为 `"grey"`）。
- 棋子只放在**深色**方格上。
- 中间的**两行**始终留空。所有其他行都有棋子。

## 从关系的角度思考

这次练习的核心是**永远不要硬编码**尺寸和位置。根据棋盘大小算出一个“单元格”尺寸，然后以此为基础构建每一个方格和每一个棋子。一旦正确完成，完全相同的代码将能绘制出小的 6x6 棋盘和更大的 10x10 棋盘，无需改动任何一个数字。
