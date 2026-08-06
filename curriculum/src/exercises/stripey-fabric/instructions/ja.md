---
title: "ストライプ模様の布"
description: "ストライプの色を正しく選んで、縞模様の布を織り上げましょう"
en_md5: ba93b39f1883d50139d243a16e3c204f
---

ストライプの布をロール状に織るアルゴリズムを設計してみましょう。出来上がりはこんな感じです。

<svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="20本の縦ストライプ：両端が紫色で、間には緑、青、黄色のストライプが入っています。" style="width: 200px; height: 200px; display: block; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;padding:4px;margin-top:-8px">
  <rect x="0" y="0" width="5" height="100" fill="#A020F0" />
  <rect x="5" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="10" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="15" y="0" width="5" height="100" fill="#008000" />
  <rect x="20" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="25" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="30" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="35" y="0" width="5" height="100" fill="#008000" />
  <rect x="40" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="45" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="50" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="55" y="0" width="5" height="100" fill="#008000" />
  <rect x="60" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="65" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="70" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="75" y="0" width="5" height="100" fill="#008000" />
  <rect x="80" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="85" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="90" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="95" y="0" width="5" height="100" fill="#A020F0" />
</svg>

模様は、`"yellow"`、`"blue"`、`"yellow"`、`"green"`の繰り返しです。最初と最後のストライプは`"purple"`です。

キャンバスのサイズは幅`100`、高さ`100`です。幅`5`のストライプを`20`本描く必要があります。

### 演習のルール

この演習は、20個の長方形の文を書くだけでは解けません。書くコードは、布地がどんな大きさでも機能するようにする必要があります。実際には、`rectangle(...)`（長方形を描く関数）はコードの中で1回しか使えません！

代わりに、前回のビデオレッスンで学んだ余り演算子を使ってループを組む必要があります。命令文の順序を慎重に考えることが、この演習をクリアする鍵です。

焦らずに、楽しんでください！
