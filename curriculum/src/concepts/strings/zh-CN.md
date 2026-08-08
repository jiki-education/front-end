---
title: "字符串"
description: "用引号包裹的文本片段（一个字母、一个词、一句话或一整段），Jiki 会把它写在纸上。"
en_md5: 89b04f3849f9388a46734924f35c913c
---

当你想使用一个数字时，你直接写下那个数字，Jiki 就明白你的意思。但如果你想使用一个字母、一个单词或一个句子呢？比如，对于 `rectangle`（矩形）函数或 `circle`（圆形）函数，如果你多了一个输入来指定颜色，该怎么办？我们要怎样把颜色写进机器里？如果我们直接写 `green`（绿色）或 `blue`（蓝色），Jiki 会以为我们在指货架上的某台机器，然后他会说：“这里没有一台叫 green 的机器。我不知道该怎么办。”

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/rectangle-confused.webp"
  alt="Jiki 站在矩形机器旁一脸困惑，头顶冒出问号"
  width="446"
  height="400"
/>

所以我们有一条规则：只要我们需要使用文本，就必须把它放在引号里，放在双引号里。当你像这样把内容放进引号时，Jiki 会拿出一张纸，把你放在引号里的内容写在那张纸上，而我们把这些纸张称为字符串（英语：string）。

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/jiki-writing-green.webp"
  alt="Jiki 在纸上写下单词 green，这张纸就变成了一个字符串"
  width="398"
  height="400"
/>

字符串可以是单个字母、单词、句子、段落，甚至是整本书。规则是：只要它是文本，我们就把它放在引号里，它就变成了字符串。

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/string-examples.webp"
  alt="一块白板上展示了不同长度的字符串及其引号：单个字母、一个单词、一句话，以及一个多行地址"
  width="500"
  height="398"
/>

所以如果我们想要一个蓝色的矩形，我们为它的左边位置、上边位置、宽度和高度分别写上数字。但第五个输入，我们要用引号写上 `"blue"`。

```javascript
rectangle(10, 20, 30, 40, "blue")
```

Jiki 会从货架上取下机器，把几枚硬币放进前四个投入口。然后他在一张纸上写下 blue，把那张纸放进第五个投入口，再运行机器。

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/rectangle-blue-slot.webp"
  alt="Jiki 正把写着 blue 的纸塞进矩形机器的第五个投入口，前四个投入口里已放入了硬币 10、20、30、40"
  width="500"
  height="392"
/>

字符串是那种起初让人觉得有点吓人的技术术语，但实际上它就只是指文本。你很快就能习惯。它并没有什么神奇之处。
