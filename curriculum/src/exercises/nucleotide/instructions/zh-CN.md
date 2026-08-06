---
title: "核苷酸"
description: "计算特定核苷酸在 DNA 链中出现的次数。"
en_md5: 7ab4068481d406fdfb6f598fabd042c1
---

DNA 是由其他化学物质组成的长链，其中最重要的四种是核苷酸：腺嘌呤、胞嘧啶、鸟嘌呤和胸腺嘧啶。一条 DNA 链可能包含数十亿个这四种核苷酸，它们排列的顺序非常关键！我们用一个字符字符串来表示 DNA 序列，例如 "ATTACG"。'A' 代表腺嘌呤，'C' 代表胞嘧啶，'G' 代表鸟嘌呤，'T' 代表胸腺嘧啶。

创建一个名为 `countNucleotide`（计算核苷酸数量）的函数，它接收一个 DNA 链和一个单独的核苷酸字符，并返回该核苷酸在链中出现的次数。

如果核苷酸字符无效（即不是 A、C、G、T 中的一个），返回 `-1`。
如果链中包含任何无效字符，也返回 `-1`。

例如：

- `countNucleotide("GATTACA", "A")` 返回 `3`
- `countNucleotide("GATTACA", "T")` 返回 `2`
- `countNucleotide("GATTACA", "X")` 返回 `-1`

如果需要，你可以使用 `"...".includes(someString)`。
