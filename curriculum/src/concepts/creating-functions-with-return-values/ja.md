---
title: "関数にreturnを追加する"
description: "`return`キーワードを使い、自分自身の関数に、値を呼び出し元に返す返却シュートを追加する方法。"
en_md5: 51d31f709a7051c29b499a31ad68555e
---

入力あり／なしの関数は、もう作れるようになりましたね。あと一つ覚えれば、関数作りのエキスパートです。それが、関数に**返却シュート**を持たせる方法です。

戻り値のある関数は、もうたくさん使ってきましたね。`isAlienAbove`（画面上にエイリアンがいるかどうかを返す）は、`true`か`false`を返します。`Math.randomInt(1, 10)`（1から10のランダムな整数を返す）は、ランダムな数値を返します。

Jikiがそうした関数を使うと、返却シュートから何かが飛び出してきて、それをあとで使うことができます。

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-return-values/output-chute.webp"
  alt="機械の返却シュートから飛び出した値を受け取るJiki"
  width="500"
  height="312"
/>

このために、もう一つ新しいキーワードが必要です。それが `return` キーワードです。

`return` キーワードは、小さなJikiに、返却シュートから何かを押し出すように伝えます。

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-return-values/return-keyword-push.webp"
  alt="機械の中で、返却シュートから42の値を押し出している小さなJiki"
  width="500"
  height="335"
/>

では、関数を作ってみましょう。名前は `meaningOfLife`（人生の意味）にします。この関数の仕事は、いつでも `42` という数値を返すことです。入力はありません。次のように書きます。

```javascript
function meaningOfLife() {
  return 42
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-return-values/meaning-of-life-42.webp"
  alt="42の数字を返却シュートから送り出すmeaningOfLife機械"
  width="500"
  height="323"
/>

これで、コードの中で `meaningOfLife()` を使う場所ならどこでも、他の値と同じように `42` という数値が返ってきます。`let` で箱に入れたり、別の関数の入力として渡したり、`if` 文の中で比較したりできます。

戻り値のある関数は、入力も受け取れます。たとえば `ageBracket(age)`（年齢に応じた区分を返す）という関数を作るとしましょう。`age` が18未満なら `"Sorry, too young"`、それ以外なら `"Welcome"` を返します。この関数を呼び出す側には、関数が返した文字列がそのまま手に入ります。

```javascript
function ageBracket(age) {
  if (age >= 18) {
    return "Welcome"
  }
  return "Sorry, too young"
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-return-values/age-input.webp"
  alt="機械の差し込み口に年齢の値が入れられ、戻り値を決める"
  width="487"
  height="400"
/>

これがプログラミングの核心です。小さな部品をたくさん作って、それを組み合わせてプログラムを作り上げるのです。
