---
title: "瓷砖架"
description: "精确找出字母在瓷砖架上的位置。"
en_md5: 156e18323706fc278f7a887f421c01f3
---

你正在构建一个自动化拼字游戏机器人。机器人有一个字母瓷砖架，用字符串表示（例如 `"AERHBT"`）。当机器人决定要出哪个字母时，它需要知道要将手移动到哪个位置（英语：position）才能拿起瓷砖。

编写一个名为 `findTile`（查找瓷砖）的函数，它接收字母架（一个字母串）和需要查找的字母。如果找到了瓷砖，则返回 `"Move to position X"`，其中 X 是第一个匹配瓷砖的位置（从 1 开始）。如果瓷砖不在架子上，则返回 `"Error: Tile not on rack"`。

要构建结果字符串，你需要将位置数字转换为字符串，然后使用拼接（`+`）或模板字符串将各部分组合起来。

例子：

- `findTile("ABCDE", "A")` 返回 `"Move to position 1"`
- `findTile("ABCDE", "C")` 返回 `"Move to position 3"`
- `findTile("BANANA", "A")` 返回 `"Move to position 2"`（第一个 A）
- `findTile("ABCDE", "Z")` 返回 `"Error: Tile not on rack"`
