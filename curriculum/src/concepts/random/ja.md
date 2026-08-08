---
title: "乱数"
description: "`Math.randomInt`に最小値と最大値を指定して、実行のたびに異なる数値を得る方法。"
en_md5: 5f41de1ca5327be4a86a69d801f1b6f9
---

プログラミングでは、関数を使って毎回異なる乱数（英: _random number_）を返してもらいたい場面がよくあります。

これはあらゆる場面で役立ちますが、特に暗号技術では、機械同士で共有するコードを作るといったことを多く行い、それらのコードはハッキングされないようにランダムである必要があるため、非常に重要です。

このために、`Math.randomInt`（Mathは数学、randomIntは「ランダムな整数」を意味します）という関数が使えます。その名前の真ん中にドットがあるのに気づくかもしれません。関数が増えてくると、整理するためにそれらをグループに分けることができ、`Math`（Mathは数学の略称です）の部分は、この関数が属するグループの名前です。これは、Jikiに棚のどの区画を見に行けばいいかを教えます。ここでは、`Math`の区画です。ドットは単に、その区画に行って関数を見つけるということを意味しています。今はあまり気にしなくて大丈夫です。演習の指示では、どの関数が使えてどのように使うかがいつも示されます。理解しておくべき重要なことは、Jikiがこの関数を使うと、実行するたびに異なる数値が返ってくる、という点です。ただし、ひとつ制約があります。この関数には2つの入力があります。1つ目は、その機械が返すことを許される最小の数値で、2つ目は最大の数値です。ですから、`Math.randomInt`関数に`10`と`13`を与えると、必ず`10`、`11`、`12`、`13`のいずれかが返ってきます。ただし、毎回異なる値が返ってきます。

<img
  class="concept-image"
  src="/static/images/concept-assets/random/jiki-shelves-math.webp"
  alt="Jikiが倉庫の棚のMathの区画にはしごで登っているところ"
  width="440"
  height="400"
/>

```javascript
Math.randomInt
```

<img
  class="concept-image"
  src="/static/images/concept-assets/random/function-two-inputs.webp"
  alt="上部に2つの入力じょうごが付いたMath.randomIntの機械"
  width="500"
  height="378"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/random/function-10-13.webp"
  alt="入力じょうごに10と13が入り、10、11、12、13のいずれかを生成するMath.randomIntの機械"
  width="488"
  height="400"
/>

では、キャンバス上のランダムな位置に円を描きたいとしましょう。`Math.randomInt`を使って、`left`と`top`の値を毎回ランダムに取得できます。ただし、たとえば`10`から`90`のような範囲を設けて、円が重なったりキャンバスからはみ出したりしないようにします。このコードを実行するたびに、円は少しだけ違う場所に描かれます。
