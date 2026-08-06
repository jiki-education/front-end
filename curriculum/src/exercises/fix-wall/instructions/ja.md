---
title: "壁を直そう"
description: "長方形を使って壊れた壁の隙間をふさごう。"
en_md5: ba2f5a5d726cef8cb80841c6e16132c6
---

最初の描画演習へようこそ。この演習では、`rectangle`（長方形）関数（英: _function_）を使って長方形を描きます。

長方形を描くには、上位置、左位置、幅、高さを知る必要があります。`rectangle`関数を使うとき、これらを入力（英: _input_）として指定できます。

- `left`（左位置）: 長方形の左端の位置
- `top`（上位置）: 長方形の上辺の位置
- `width`（幅）: 長方形の幅
- `height`（高さ）: 長方形の高さ

<img src="/static/images/exercise-assets/fix-wall/intro-rectangle.webp" alt="壁を直す" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

常に幅100、高さ100のキャンバスに描画します。したがって、キャンバスの左上は `0,0`、右下は `100,100` です。**キャンバスにカーソルを合わせると**、どこに何を描くべきか確認できます。

### 壁を直そう

ここでの作業は、3つの長方形を使って壁の穴をふさぐことです。

楽にするために、上位置、左位置、高さ、幅はすべて10で割り切れる値になっています。
