---
title: "天际线"
description: "用随机建筑构建一整条城市天际线。"
en_md5: cb89a31566f55397d19e1375dbac44cc
---

在“摩天大楼”练习中，你曾创建一座高度可变的摩天大楼。这一次，我们要更进一步，创建一片由不同高度、不同宽度的建筑物组成的城市天际线。

你有一个函数 `numBuildings()`（建筑物数量），它会告诉你该场景下需要创建多少栋建筑。此外，你还有 `randomWidth()`（随机宽度）和 `randomNumFloors()`（随机楼层数）函数。你应当使用它们来确定该场景中每栋建筑的宽度和楼层数。第一次调用这些函数时会返回第一栋建筑的对应值，以此类推。

建筑群左边留有一个 `1` 列的间隙，建筑之间同样留有 `1` 列的间隙。

因此，假设某个场景中 `numBuildings()` 返回 `2`，`randomWidth()` 依次返回 `5` 和 `7`，`randomNumFloors()` 依次返回 `4` 和 `8`，你将会得到以下布局（`xxxxx` 代表水泥地面）

```
       WWWWWWW
       WGGGGGW
       WGGGGGW
       WGGGGGW
 WWWWW WGGGGGW
 WGGGW WGGGGGW
 WGGGW WGGGGGW
 WGGGW WGGGGGW
 WGEGW WGGEGGW
xxxxxxxxxxxxxxxxxxxxxxx
```
