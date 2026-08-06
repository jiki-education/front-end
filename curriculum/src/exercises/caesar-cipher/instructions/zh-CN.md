---
title: "凯撒密码"
description: "使用古罗马密码加密秘密消息。"
en_md5: 029bbd7050127405f5e67a3a20353139
---

凯撒密码是最早且最简单的加密技术之一。尤利乌斯·凯撒曾用它向将军们发送秘密消息。

这个密码通过将消息中的每个字母在字母表中移动固定数量的位置来运作。例如，当偏移量为 3 时，'a' 变成 'd'，'b' 变成 'e'，以此类推。如果偏移超过 'z'，则循环回到字母表的开头。

空格应保持为空格（不进行移动）。

创建一个名为 `encode(message, shift)` 的函数（即编码函数），接收一个小写字母的消息和一个偏移量，返回加密后的消息。

例如：

- `encode("abc", 1)` 返回 `"bcd"`
- `encode("xyz", 3)` 返回 `"abc"`（循环回绕）
- `encode("hello world", 5)` 返回 `"mjqqt btwqi"`

提示：最好将这个问题拆成几个小型的辅助函数！

### 趣闻

我曾在葡萄牙布拉加的一个技术会议上担任主持人。就在我准备上台的五分钟前，组织者有点不好意思地问我，是否介意在当天的第一部分打扮成尤利乌斯·凯撒，以庆祝布拉加的罗马文化遗产。我成功扮得像吗……？

<img
  src="/static/images/exercise-assets/caesar-cipher/jeremy-as-caesar.webp"
  alt="打扮成凯撒的 Jeremy"
  style="width: 100%; max-width: 300px; border: 5px solid var(--color-purple-500); padding: 4px; border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;"
/>
