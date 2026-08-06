---
title: "スカイライン"
description: "ランダムな建物で街のスカイラインを作りましょう。"
en_md5: cb89a31566f55397d19e1375dbac44cc
---

「Skyscraper」演習では、高さの異なる1つの超高層ビルを作成しました。今回はさらに進んで、高さと幅が異なるビルを並べたスカイラインを作ります。

まず、`numBuildings()`（建物の数）という関数があります。この関数は、そのシナリオで作成すべきビルの棟数を教えてくれます。さらに、`randomWidth()`（幅のランダムな値）と`randomNumFloors()`（階数のランダムな値）という関数があります。これらの関数を使って、そのシナリオにおける各ビルの幅と階数を決定します。関数を最初に呼び出すと1棟目の値が得られ、次に呼び出すと2棟目の値が得られます。

ビル群は左端から`1`列分の隙間を空けて始まり、ビル同士の間にも`1`列分の隙間があります。

例えば、あるシナリオで`numBuildings()`が`2`を返し、`randomWidth()`が最初に`5`、次に`7`を返し、`randomNumFloors()`が最初に`4`、次に`8`を返した場合、以下のような配置になります（ここで`xxxxx`は床のコンクリート部分です）。

```
       WWWWWWW
       WGGGGGW
       WGGGGGW
       WGGGGGW
 WWWWW WGGGGGW
 WGGGW WGGGGGW
 WGGGW WGGGGGW
 WGGGW WGGGGGW
 WGEGW WGGEGGW
xxxxxxxxxxxxxxxxxxxxxxx
```
