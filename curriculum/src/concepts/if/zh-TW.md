---
title: "If 敘述"
description: "使用`if`關鍵字，讓程式碼只在特定條件為 true 時執行，就像保鑣只讓符合規定的人進門一樣。"
en_md5: 8797e078e1ad90b7652373baf6f96f28
---

有一個關鍵字可以幫我們告訴 Jiki，只在特定的情況下才做事。也許你正在寫一段守衛酒吧門口的程式碼，或者你是一名保鑣，而 Jiki 只有在客人穿著得體時才應該開門。又或者你寫的程式碼負責在賽車比賽結束時揮舞方格旗，但 Jiki 需要知道，他只能在最後一圈時這麼做。在這些情況下，我們就會使用`if`關鍵字。

<img
  class="concept-image"
  src="/static/images/concept-assets/if/bar-door-scenario.webp"
  alt="Jiki 擔任保鑣，決定是否讓人進入夜店"
  width="292"
  height="400"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/if/waving-flag.webp"
  alt="Jiki 準備在比賽結束時揮舞方格旗"
  width="266"
  height="400"
/>

我們使用`if`關鍵字的方式，和`repeat`非常相似。我們會把一些資訊放在括號裡。在這裡，這個資訊就是我們正在檢查的條件（英語：_condition_）。然後，我們把一段程式區塊放在大括號裡，只有當這個條件為`true`時，才會執行這段程式碼。

```javascript
if (condition) {
}
```

那麼，這些條件看起來像什麼呢？通常，它們會是某種比較（英語：_comparison_）。我們會比較兩個數字或字串，並檢查結果是`true`還是`false`。

你可以把這些當作是可以大聲說出來的敘述（英語：_statements_）。3 小於 5。這是`true`。7 小於 2。這是`false`。

我們會使用符號來寫這些比較。你可能已經在數學裡看過它們了。我們有小於、大於、小於或等於、大於或等於，我們也可以檢查兩個東西是否相同、是否相等。而這一個可能跟你習慣的有點不同，因為我們會連續使用三個等號，來檢查兩個東西是否相同。

<img
  class="concept-image"
  src="/static/images/concept-assets/if/comparisons-symbols.webp"
  alt="比較運算子表格：小於、大於、小於或等於、大於或等於、等於以及不等於，並附有範例"
  width="449"
  height="400"
/>

這能幫助我們，在設定或更新變數時不會搞混，因為那時我們是使用一個等號來表示「把這個放進盒子裡」。只要記住，三個等號是用來比較的喔。

你也可以比較字串。所以`"hello"`等於`"hello"`。這是`true`。這兩個字串是一樣的。但在這裡要小心，因為 Jiki 會比較這兩張紙上、兩個字串裡的每一個字元（英語：_character_）。所以大寫 H 的`"Hello"`不等於小寫 H 的`"hello"`。它們是不同的字串。因此，比較它們的結果會是`false`，因為大寫 H 和小寫 H 是不同的字元。

另外順帶一提，`true`和`false`被稱為布林值（英語：_Booleans_），這聽起來又是一個很技術性的詞。但它其實非常簡單。它只是一種正式的說法，用來表示某個東西是`true`還是`false`。所以如果你看到布林值這個詞，它指的就是`true`或`false`。

讓我們來看看實際的運作吧。想像一下，我們正在為一家夜店打造那個機器人保鑣，我們規定保鑣只有在客人年滿 21 歲時才能開門。所以我們有一個`askAge`（詢問年齡）函式，可以用來取得某人的年齡，然後我們會把結果存到一個叫做`age`（年齡）的變數裡。接著我們可以說，如果那個`age`大於 20，我們就開門。所以如果`askAge`回傳`30`，我們就開門；如果它回傳`12`，我們就不開。

```javascript
let age = askAge()
if (age >= 21) {
  openDoor()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/if/bouncer-open-close.webp"
  alt="Jiki 為年紀夠大的人開門，並拒絕年紀太小的人進入"
  width="410"
  height="400"
/>
