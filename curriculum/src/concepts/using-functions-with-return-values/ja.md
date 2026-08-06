---
title: "値を返す関数"
description: "関数の返却シュートから出てくる値を受け取り、コードで使う方法。"
en_md5: 830f19fb6aaf184c1f32ade792b60a12
---

これまでは、何かを実行する関数を見てきました。`circle`（円を描く関数）は円を描きます。`move`（キャラクターを動かす関数）はキャラクターを動かします。しかし、中には働き方が異なる関数もあります。外界に何かをする代わりに、コードの中で使えるものを返してくれるのです。関数がコードで使えるようにJikiに何かを返すとき、その関数は何かを戻す（英: _returning_）と言います。Jikiに値を返すのです。こうした機械には、返却シュートがついていると考えてください。すでに、何かを入れるための差し込み口がありますが、さらに、一つの返却口というか、何かが出てくるシュートも存在します。Jikiが機械のボタンを押すと、機械が動き出し、最後にそのシュートから何かが出てきます。数値かもしれません。文字列かもしれません。Jikiはそれを受け取り、使うことができます。

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-return-values/machine-with-return-chute.webp"
  alt="側面に返却シュートがついた機械。Jikiに値を返す準備ができている。"
  width="500"
  height="317"
/>

最後の例を見てみましょう。`getCurrentTime`（現在時刻を取得する関数）という関数があるとします。Jikiがその機械を動かすたびに、返却シュートから時刻が書かれた紙が滑り出てきます。例えば14:35と書かれているかもしれません。

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-return-values/paper-out-of-chute.webp"
  alt="getCurrentTimeの機械。返却シュートから14:35と書かれた紙が出てくる。"
  width="500"
  height="312"
/>

そして、その返された値を、`let`を使って箱に入れることができます。

```javascript
let time = getCurrentTime()
```

Jikiは機械を動かして、シュートから現在時刻を取得し、それを`time`という箱に格納します。

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-return-values/jiki-boxing-time.webp"
  alt="Jikiが返却シュートから出てきた14:35の紙を、timeと書かれた箱に入れている。"
  width="372"
  height="400"
/>

ここで重要なのは、Jikiが箱に入れる紙は、その瞬間の内容で固定されるということです。プログラムの実行中に実際の時刻が変わっても、箱の中の紙には14:35と書かれたままです。箱の中に入ったものは、そこで固定されます。魔法のように変わることはありません。将来、もう一度現在時刻を箱に入れたいときは、再び`getCurrentTime`関数を使って取得する必要があります。

値を返す関数のほとんどは、入力も持っています。例えば、2つの文字列を入力として受け取り、それらをスペースで結合して返す`join`（文字列を結合する関数）という関数があるとします。`join`の機械に`"Hello"`と`"World"`を入力として渡すと、返却シュートからは`"Hello World"`と書かれた1つの文字列が出てきます。

```javascript
join("Hello", "World"); // "Hello World"
```
