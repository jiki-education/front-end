---
title: "不设次数的重复"
description: "把 repeat 循环的括号留空，让 Jiki 一直执行，直到有东西让他停下来。"
en_md5: 5902e86c82b7bfe9ca519f9bdf8650ad
---

到目前为止，每次用 repeat 循环时，你都会指定一个数字，告诉 Jiki 要重复多少次。重复五次，十次，四十次。有时你也会用变量来做这件事。但不管怎样，你总是明确地告诉 Jiki 循环要执行多少次。然而，有些时候我们事先并不知道要重复多少次。想想迷宫。在这门课最开始的时候，你是通过写出具体的移动指令来解决迷宫的。你能看到迷宫，数出步数，然后写下正确数量的移动指令。

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat-while/maze-known-path.webp"
  alt="一个迷宫，角色可以看到路径，数出步数，并准确写出正确的移动指令"
  width="418"
  height="400"
/>

```javascript
move()
move()
turnLeft()
move()
move()
```

但如果我说：“给我写一段代码，能解决我给你的任何迷宫”呢？那个迷宫可能需要 10 步，50 步，或者 200 步。你事先完全不知道。

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat-while/maze-example.webp"
  alt="几个形状和大小各异的迷宫，Jiki 正发愁怎么解决它们"
  width="402"
  height="400"
/>

所以你需要一种方式，只告诉 Jiki 一直走下去。不断检查能往哪边走，不断做决定，不断往前走，一遍又一遍，直到走完为止。

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat-while/jiki-treadmill.webp"
  alt="Jiki 在跑步机上奔跑，一直跑啊跑"
  width="428"
  height="400"
/>

做到这一点的方法也很简单。不要给 `repeat` 关键字一个数字。就把括号留空。如果你这么做，Jiki 就会一直执行，直到有其他东西让他停下来。稍后我们会看看那些东西是什么。但现在，他只会一直跑下去，直到练习结束，或者直到他觉得自己跑了太久太久，想休息一下，觉得自己跑够了为止。

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat-while/jiki-treadmill-exhausted.webp"
  alt="Jiki 跑了很久后累倒在跑步机上，准备放弃休息"
  width="500"
  height="378"
/>
