---
title: "`not`演算子"
description: "`!`を使って真偽値を反転させる：`true`が`false`に、`false`が`true`になります。チェックを切り替えたり反転させたりするのに便利です。"
en_md5: 842c4a4e9cb1fd11c4318a1508296e27
---

これまでは、等しいかどうかを調べるときに、イコールを3つ使ってきました。しかし、等しくないかどうかを調べたいこともあります。そのときは、エクスクラメーションマークの後ろにイコールを2つ続けて書きます。そして、プログラミングでは、エクスクラメーションマーク（あるいはアメリカでは「バン」（英: _bang_）と呼ばれることもあります）は、「否定」を意味します。たとえば、お店で働いている場面を想像してみてください。ディスコ衣装は一切お断り、という方針が出たとします。

<img
  class="concept-image"
  src="/static/images/concept-assets/logical-not/shop-bouncer.webp"
  alt="お店の入り口で、列になっている人々の服装をチェックするバウンサー"
  width="451"
  height="400"
/>

これは、「もし服装がディスコでなければ、ドアを開ける」と言っているのと同じことです。`if`文もまったく同じように動きます。

```javascript
if (outfit !== "disco") {
  openDoor()
}
```

違いがあると条件は`true`を返し、同じなら`false`を返します。つまり、同じことを「もし服装がディスコなら何もしない。そうでなければドアを開ける」と書くこともできます。でも、ふつうは、`not`演算子（英: _operator_）を使ったほうが、本当に言いたいことを正確に伝えられ、シンプルに書けます。

これに関連してもうひとつ。`true`になっている変数を`false`に切り替えたいときや、`false`になっているものを`true`に反転させたいときがあります。そして、この仕組みを使って状態を管理することができます。たとえば、画面内を左右に跳ね返るものがあり、右に移動すべきときに`true`になる`movingRight`（「右に移動中」の意）という変数があるとします。右端にぶつかったら、その値を`false`に切り替える（英: _toggle_）必要があります。

<img
  class="concept-image"
  src="/static/images/concept-assets/logical-not/pong-court.webp"
  alt="ポン風のコートとパドル、左右に跳ね返るボールがあり、`movingRight`変数の切り替えを説明している"
  width="500"
  height="352"
/>

これを実現するひとつの方法は、「もし`movingRight`が`true`なら、`movingRight`を`false`にする。そうでなければ`movingRight`を`true`にする」というふうに書くことです。これで変数を切り替えることができます。Jikiは`movingRight`が`true`か`false`かを確認し、その反対を計算して箱に戻します。

```javascript
if (movingRight === true) {
  movingRight = false
} else {
  movingRight = true
}
```

でも、もっとスッキリした書き方があります。さきほどと同じエクスクラメーションマーク（バン）を使うのです：

```javascript
movingRight = !movingRight
```

これで値が反転します。`!movingRight`は、それまでの値の反対を意味します。

つまり、`movingRight`が`true`なら、`false`になり、`false`だったなら`true`になります。Jikiは現在箱に入っている値を取り出し、そのバンが「反対の値を見つけろ」と指示します。`true`の反対は`false`、`false`の反対は`true`ですから、Jikiは反対の値を箱に戻します。これは、さきほどの長い`if`/`else`文とまったく同じことをしていますが、ずっと簡潔に書けるのです。
