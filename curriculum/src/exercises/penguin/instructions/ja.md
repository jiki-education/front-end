---
title: "ペンギン"
description: "左右対称のペンギンの絵を完成させましょう。"
en_md5: bff370c28fd178d8c0ac9f65e3384e81
---

この演習では、初めて楕円を描きます。また、「Foxy Face」で触れた左右対称について、もう少し考えてみましょう。

この演習では楕円を使います。楕円とは、引き伸ばされた円のようなものです。中心点を指定するのは同じですが、半径は1つだけではなく、横の半径と縦の半径の2つを使います。縦の半径が横の半径より大きければ、楕円は縦長に見えます。逆に、横の半径が縦の半径より大きければ、横長に見えます。両方の半径を同じ値にすると、それはまた円になります。

`ellipse`（楕円）関数は、中心の位置（`centerX`（中心のX座標）と`centerY`（中心のY座標））、横の半径（`radiusX`（横の半径））、縦の半径（`radiusY`（縦の半径））、そして色の5つの入力を受け取ります。

<img src="/static/images/exercise-assets/penguin/intro-ellipse.webp" alt="楕円関数の図" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

### ペンギン

皆さんの課題は、ペンギンの右半分を描くことです。その際、**座標にカーソルを合わせて値を確認したり、当てずっぽうで決めたりせずに**、コードを読んで描いてください。完成図は以下のようになります。

<img src="/static/images/exercise-assets/penguin/penguin-finished.webp" alt="ペンギン" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

画像の半分はすでにこちらで描いてあります。そこに書いてあるコードを読めば、残りの部分を左右対称に仕上げるために必要な情報がわかるはずです。覚えておいてください。描画領域の左上は`0,0`、右下は`100,100`です。ペンギンはちょうど中央にいます。鼻の部分は、三角形の中央の座標を**変えて**ください。新しい三角形を追加する必要はありません。

まずは「"Run Code"」ボタンを押して、最初の画像がどのように見えるか確認してみましょう。楽しんでください！
