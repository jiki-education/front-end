---
title: "方法化的 Pangram"
description: "更新你的 Pangram 练习，使用内置的字符串方法。"
en_md5: 61b73caa0318f68e9a0facca189e7abf
---

欢迎来到第三个 Pangram 练习，在这里我们会把你之前写的那些辅助函数大幅简化！

我鼓励你编写的每个函数（`includes`、`indexOf` 和 `toLowerCase`）其实都已经作为方法内建在字符串里了。

所以，与其写 `includes("Jeremy", "r")`，你可以写 `"Jeremy".includes("r")`，它们的效果完全一样。而因为这个方法已经内建在字符串里，你就不需要自己去实现它了！

在这个练习中，你只需要用到其中的两个：

- `"Jeremy".toLowerCase()`
- `"Jeremy".includes("r")`

你完全不再需要 `indexOf` 了——你之前写它只是为了辅助实现 `toLowerCase`，而现在内建的 `toLowerCase` 已经帮你完成了这份工作。

所以，你可以把你之前写的那些函数都删掉（但至少你现在知道了这些方法在底层是怎么运作的，所以千万别来吼我！），改用这里的方法就行了。

玩得开心！
