---
title: "関数に入力を追加する"
description: "自分の関数に差し込み口を追加して、渡された値に応じて異なる動作をさせられるようにします。"
en_md5: f70d737888fcbda3306196ff069eb2f1
---

これまでに作った関数は、いつもまったく同じことをします。`turnAround`（方向転換）は、いつも左に2回曲がります。`shootIfAlienAbove`（エイリアンが上にいたら撃つ）は、常にチェックしてから撃ちます。

でも、これまでのコースで使ってきた関数を思い出してみてください。それらは入力によって異なる動作をします。たとえば、`Rectangle` は左の位置、上の位置、幅、高さを入力として受け取り、与えられた値に応じて異なる長方形を描きますね。

さあ、自分で作る関数にも差し込み口を追加してみましょう。

そのためには、2つのことを知っておく必要があります。1つ目は、実際にどんなふうに書けばよいか。2つ目は、その裏で何が起こっているかです。

最初の部分はとても簡単です。普通の括弧（`()`）を書き、その中に受け取りたい入力の名前を書くだけです。

たとえば、何度も撃つ関数を作るとします。これを `shootMany`（たくさん撃つ）と名付けましょう。

この関数は次のように書きます。

```javascript
function shootMany(numShots) {
  // ...
}
```

この関数を使いたいときは、撃ちたい回数を渡して呼び出します。

```javascript
shootMany(5)
shootMany(2)
```

さて、ここが重要なポイントです。コードが実行されると、`5` や `2` といった入力値が何であれ、関数の中で帽子をかぶったミニJikiがその入力を受け取り、`numShots`（弾の数）という名前の箱に入れます。そしてその箱を、関数の内部の棚に置いて、関数のコードの中で使えるようにしてくれます。

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-inputs/numshots-box.webp"
  alt="shootMany機械の中で、ミニJikiが入力値を numShots というラベルの箱に入れているところ"
  width="500"
  height="376"
/>

もう一度言いましょう。

`shootMany(5)` と書いて関数を使うとき、外側にいるJikiが `5` を取りに行き、`shootMany` の差し込み口に入れます。機械の中では、ミニJikiがその `5` を取り出して、`numShots` という箱に入れます。なぜなら、それが差し込み口に付けた名前だからです。そして彼はその箱を、機械の中の関数の内側の棚に置きます。

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-inputs/numshots-on-shelf.webp"
  alt="ミニJikiが numShots の箱を shootMany機械の内部の棚に置いているところ"
  width="500"
  height="302"
/>

そして関数の中では、`numShots` の箱を、他の箱とまったく同じように使うことができます。`numShots` という名前に特別な意味はありません。どんな名前でもかまいません。これは要するに、ミニJikiに対して、「関数の中で常にそのラベルの付いた箱を作り、差し込み口に渡されたものをその箱に入れなさい」という指示にすぎません。

一度その箱に値が入ってしまえば、箱に対して普段できることは何でもできます。たとえば、`numShots` の箱を `repeat` ループの一部に使って、正しい回数だけ撃つことができます。また、入力は複数持たせることもできます。その場合は、カンマで区切ります。

たとえば、左上の位置をもとに星を描く `drawStar`（星を描く）という関数があるとします。次のように書きます。

```javascript
function drawStar(left, top) {
  // ...
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-inputs/draw-star-two-slots.webp"
  alt="drawStar機械に2つの差し込み口があり、別々の値を受け取っているところ"
  width="453"
  height="400"
/>

そして、関数が呼び出されると、ミニJikiは入力として渡された値を、`left`（左）と `top`（上）という名前の箱に入れて、それを関数の内部の棚にしまってくれます。

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-inputs/draw-star-boxes-shelf.webp"
  alt="ミニJikiが2つの入力を、左と上というラベルの付いた箱に入れて、drawStar機械の内部の棚にしまっているところ"
  width="431"
  height="400"
/>
