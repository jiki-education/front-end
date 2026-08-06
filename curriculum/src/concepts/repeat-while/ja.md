---
title: "回数を指定しない繰り返し"
description: "repeatループの括弧を空にすると、停止の合図があるまでJikiが動き続けるようになります。"
en_md5: 5902e86c82b7bfe9ca519f9bdf8650ad
---

これまで、`repeat`ループを使うときは、必ず何回繰り返すかを数で指定してきました。5回、10回、40回。変数を使って回数を決めることもありました。いずれにしても、Jikiにはっきりと「この回数だけ繰り返して」と伝えていたのです。ところが、あらかじめ繰り返しの回数がわからない場面もあります。迷路を思い出してください。このコースの最初の方で、具体的な動きを書き並べて迷路を解きましたね。迷路を見て、歩数を数え、ちょうどいい数の動きを書くことができました。

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat-while/maze-known-path.webp"
  alt="キャラクターが迷路の道筋を見て、歩数を数え、正しい動きを正確に書き出せる迷路"
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

でも、「どんな迷路を渡されても解けるコードを書いて」と言われたらどうでしょう。その迷路は10歩で抜けられるかもしれませんし、50歩、200歩かかるかもしれません。前もって予想なんてできません。

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat-while/maze-example.webp"
  alt="形も大きさも異なるさまざまな迷路と、どうすればどんな迷路でも解けるのか考えあぐねているJiki"
  width="402"
  height="400"
/>

そこで必要になるのが、「とにかく動き続けろ」とJikiに伝える方法です。どちらの道に進めるかを確認し、判断を下し、前に進む。それを、終わるまで何度も何度も繰り返すのです。

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat-while/jiki-treadmill.webp"
  alt="トレッドミルの上を走り続けるJiki、ただひたすら動き続けている"
  width="428"
  height="400"
/>

そのやり方は、実に簡単です。`repeat`キーワードに数を渡さなければいいのです。括弧（`()`）を空っぽにするだけ。そうすれば、Jikiは何かが停止を命じるまで、延々と動き続けます。その「何か」が何なのかは、また後ほど見ていきましょう。ですが今のところは、演習が終わるまで、あるいは「もうずいぶん長いこと動いてきたし、そろそろ休みたい、もう十分だ」とJiki自身が判断するまで、ずっと動き続けるものだと思っておいてください。

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat-while/jiki-treadmill-exhausted.webp"
  alt="長い時間走り続けてトレッドミルにぐったりともたれかかるJiki。もう十分だと、休憩したくなっている"
  width="500"
  height="378"
/>
