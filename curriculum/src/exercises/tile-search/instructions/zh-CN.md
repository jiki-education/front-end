---
title: "字母牌搜索"
description: "在字母牌组中搜索特定字母。"
en_md5: bbbc77ef2c270fd4228d6a20e690a095
---

你正在构建一个拼字游戏机器人。在机器人尝试出一个词之前，它需要检查自己的牌架上是否有某个特定的字母牌。

牌架表示为一个字母字符串（例如 `"SCRAB"`）。

编写一个名为 `contains`（包含）的函数，它接受两个输入：

- `haystack`（待搜索的字母牌组）：牌架中的字母，以字符串表示
- `needle`（要查找的字母）：需要寻找的字母

如果该字母在牌架上，返回 `true`，否则返回 `false`。

示例：

- `contains("SCRAB", "A")` 返回 `true`
- `contains("SCRAB", "Z")` 返回 `false`
- `contains("", "A")` 返回 `false`
