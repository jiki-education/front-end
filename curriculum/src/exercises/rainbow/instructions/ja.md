---
title: "虹"
description: "100本のカラフルな縦棒で虹を描きましょう。"
en_md5: 18cf1d57b1f3683a4484b507528f9acb
---

100本の縦棒で美しい虹のパターンを作ってみましょう。次のようなイメージです。

<img src="/static/images/exercise-assets/rainbow/example.webp" alt="虹" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

虹は`100`本のバーから成り、それぞれ上から下まで伸びて、幅は`1`です。最初のバーは`x`（x座標）が`0`になり、最後のバーは`x`が`99`になります。

色を指定するには、`hsl(...)`（色相・彩度・輝度を指定する色指定関数）関数を使います。この関数は色の文字列を返します（英: _returns_）。その文字列を`rectangle(...)`（四角形を描画する関数）の最後の入力として使います。彩度（英: _saturation_）と輝度（英: _lightness_）の値を`50`くらいに設定するのが良いでしょう。最初のバーは**色相（英: *hue*）**が`0`になります。バーごとに色相を増やしていき、最終的に`300`付近にします。
