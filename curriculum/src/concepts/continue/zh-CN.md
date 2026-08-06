---
title: "Continue"
description: "在循环中使用 `continue` 关键字，跳过本次迭代的剩余部分，直接进入下一次迭代。"
en_md5: 6c3f7483826e27d44d6c404cc9f621dd
---

有时候，我们可能想要跳过循环中的某一次迭代，而不是直接跳出循环。假设我们只想对奇数执行操作。

我们想表达：如果 `i`（循环变量）是奇数，就跳过这次循环。

但我们并不想完全退出循环。我们只是想跳过这一次迭代，然后处理下一次。

为此，我们还有另一个关键字：`continue`。

当 Jiki 看到 `continue` 时，他会直接跳回循环顶部，进入下一次迭代。因此，在 `for-of` 循环中，如果遇到 `continue`，他会移动到列表中的下一个元素。

```javascript
for (let item of list) {
  if (item === "something") {
    continue; // 跳过 "something" 项的循环剩余部分
  }
  // 循环的剩余部分...
}
```

在 `for` 循环中，他会执行 `i++` 的自增，然后开始下一次迭代。

```javascript
for (let i = 0; i < 10; i++) {
  if (i % 2 === 0) {
    continue; // 跳过偶数的循环剩余部分
  }
  // 循环的剩余部分...
}
```
