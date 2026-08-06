---
title: "チェッカーボード"
description: "どんなサイズのチェッカーボードでも描き、盤の大きさからすべての位置を計算して、ゲームの準備をします。"
en_md5: 1669c45c882ce94e16651bfc2d77a172
---

このプロジェクトでは、チェッカーボードを描き、駒を配置します。ドラフト（チェッカーとも呼ばれます）のゲームが始められる状態にしましょう。

どんなボードサイズでも動くコードを書いてください。試しに3つのサンプルボードを用意しました。クラシックな8x8、小さめの6x6、大きめの10x10です。`getBoardSize()`（ボードの大きさを取得する関数）を使うと、そのときのボードが縦横何マスかがわかります（ボードは常に正方形です）。

<div style="display: flex; gap: 8px; margin: 12px 0;">
  <img src="/static/images/exercise-assets/checkerboard/board-6.svg" alt="6x6のチェッカーボード" style="width: 33.333%; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);" />
  <img src="/static/images/exercise-assets/checkerboard/board-8.svg" alt="8x8のチェッカーボード" style="width: 33.333%; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);" />
  <img src="/static/images/exercise-assets/checkerboard/board-10.svg" alt="10x10のチェッカーボード" style="width: 33.333%; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);" />
</div>

### ボード

いつも通り、キャンバスの大きさは常に幅`100`、高さ`100`です。次の2つのルールに従ってください。

- ボードの周囲には幅`2`の`"black"`の枠線を付けます。
- マス目は`"dark brown"`と`"white"`が交互に並び、枠線の内側のスペースをきれいに使い切ります。左下のマス目は必ず`"dark brown"`にし、`"white"`にはしません。

### 駒

- 各駒はマス目の中央に置きます。
- 駒は外側の枠線と内側の色がある、縁の盛り上がった円形です。
  - 駒全体の直径は、マス目の一辺の長さの80%です。
  - 内側の円の直径は、駒全体の直径の75%です。
- ボードの**上**の行には`"charcoal"`の駒を置きます（枠は`"black"`）。
- ボードの**下**の行には`"white"`の駒を置きます（枠は`"grey"`）。
- 駒は**暗い**マス目にだけ置きます。
- **真ん中の2行**は常に空けておき、それ以外の行すべてに駒を置きます。

## 関係性で考えましょう

この演習の肝は、サイズや位置を**決め打ちにしない**ことです。ボードサイズから1マスのサイズを計算し、そこからすべてのマス目と駒を組み立てます。うまくできれば、まったく同じコードで6x6の小さなボードも10x10の大きなボードも、1つの数字も変えずに描けるようになります。
