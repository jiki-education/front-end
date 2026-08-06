---
title: "文字列"
description: "引用符で囲まれたテキスト（一文字、単語、一文、段落全体など）を、Jikiが紙に書き写したものです。"
en_md5: 89b04f3849f9388a46734924f35c913c
---

数値を使いたいときは、その数値をそのまま書けば、Jikiは理解してくれます。でも、文字や単語、文章を使いたいときはどうでしょう？　たとえば、`rectangle`（長方形）関数や`circle`（円）関数で、色を指定する入力を追加したとします。機械に色を入れるにはどう書けばいいのでしょうか？　単に`green`（緑）や`blue`（青）という単語を書くと、Jikiは棚の上の機械を指していると思い、「greenという機械はありません。どうすればいいかわかりません」と言ってしまいます。

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/rectangle-confused.webp"
  alt="長方形の機械の横で困惑しているJiki。頭の上には疑問符が浮かんでいます。"
  width="446"
  height="400"
/>

そこで、ルールがあります。テキストを使うときは必ず、引用符、つまり二重引用符で囲む必要があるのです。このように引用符で囲むと、Jikiは紙を取り出して、その引用符の間に書かれた内容を紙に書き写します。そして、この紙のことを文字列（英: _strings_）と呼びます。

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/jiki-writing-green.webp"
  alt="Jikiが紙に「green」という単語を書いているところ。それが文字列になります。"
  width="398"
  height="400"
/>

文字列は、1文字、単語、文、段落、本全体にまでなれます。ルールは、テキストであれば引用符で囲み、それが文字列になるということです。

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/string-examples.webp"
  alt="長さの異なる引用符付きの文字列が書かれたホワイトボード：1文字、単語、文、複数行の住所"
  width="500"
  height="398"
/>

では、青い長方形を作りたい場合、左端の位置、上端の位置、幅、高さの数値を書きます。でも、5つ目の入力には、引用符で囲んだ`"blue"`を書きます。

```javascript
rectangle(10, 20, 30, 40, "blue")
```

Jikiは棚から機械を取り出し、最初の4つの差し込み口にコインを入れます。それから、紙に「blue」と書いて、その紙を5つ目の差し込み口に入れ、機械を動かします。

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/rectangle-blue-slot.webp"
  alt="Jikiが長方形の機械の5つ目の差し込み口に青い紙を入れているところ。最初の4つの差し込み口には10、20、30、40のコインが入っています。"
  width="500"
  height="392"
/>

文字列という言葉は、最初は少しとっつきにくく感じるかもしれませんが、実際はただのテキストのことです。すぐに慣れますよ。何も不思議なものではありません。
