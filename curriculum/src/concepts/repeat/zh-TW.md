---
title: "Repeat 迴圈"
description: "使用`repeat`關鍵字，告訴 Jiki 將大括號內的程式碼執行特定的次數。"
en_md5: 8ae468aa2be428f22b6eef47b3bdea68
---

到目前為止，所有的程式碼都是以線性的方式撰寫，Jiki 會由上到下依序執行每一個指令。

現在，我們要來看看 Jiki 如何打破這種嚴格的由上到下流程。具體來說，我們要學習如何告訴 Jiki 連續多次執行同一段程式碼。

舉例來說，想像你正在迷宮中，想要往前走 10 步。雖然有一個`walk`函式可以幫忙，但如果它不存在呢？如果你只有`move`（移動）函式該怎麼辦？

與其連續寫 10 次`move`，這會變得非常重複，我們需要能夠這樣說：「嘿，Jiki，把我接下來說的事情做 10 次。

`Move`。」

要在程式碼中做到這一點，我們需要使用我們的第一個關鍵字（英語：_keyword_），而關鍵字是 Jiki 聽得懂的指令。它們看起來有點像機器，但其實不是。當 Jiki 看到關鍵字時，他不會去架子上找機器，而是直接知道要做某件事。這已經內建在他的大腦裡了。在這門課程裡，我們大約會學到 20 個不同的關鍵字，而其中的第一個就是`repeat`關鍵字。

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/jiki-keywords-2.webp"
  alt="Jiki 被 repeat、if、else、and、or 等關鍵字圍繞，並附有註解說明關鍵字是 Jiki 聽得懂的指令"
  width="358"
  height="400"
/>

`repeat`關鍵字的作用就如同我上面所說的。它告訴 Jiki：「把我接下來說的事情重複這麼多次。」來看看這段程式碼吧。首先，我們要使用`repeat`關鍵字來告訴 Jiki，他將要多次執行某件事。接著，我們在括號中填入你希望 Jiki 重複的次數，然後我們會看到大括號，而在這些大括號裡面的，就是我們希望 Jiki 重複執行的事情。這種寫法在程式設計中非常常見。我們會指定一個關鍵字，通常會附帶一些資訊（以這個例子來說，就是執行的次數），然後是一個放在大括號裡的程式區塊（英語：_code block_）。所以回到迷宮世界，與其寫`move`、`move`、`move`、`move`，我們可以寫重複 4 次`move`。

```javascript
repeat(4) {
  move()
}
```

Jiki 看到這段程式碼後，他就會連續使用 4 次`move`機器。

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/jiki-running-loop.webp"
  alt="Jiki 連續使用 4 次 move 機器，一個接一個"
  width="421"
  height="400"
/>

而且，我們在大括號裡也不限於只能放一件事。Jiki 可以重複執行多件事情。我們可以告訴 Jiki 先`move`，然後`turnLeft`，並把這整組動作重複 4 次。如果 Jiki 看到這個，他會先使用`move`機器，接著是`turnLeft`機器，然後再使用`move`機器，接著又是`turnLeft`機器，依此類推，直到他把這兩個動作都執行了 4 次為止。

```javascript
repeat(4) {
  move()
  turnLeft()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/if-else-code.webp"
  alt="Jiki 先使用 move 機器再使用 turnLeft 機器，並將這對動作重複 4 次"
  width="500"
  height="390"
/>

我們把這些重複的指令稱為迴圈（英語：_loops_），而且有很多種不同的迴圈可以使用，它們的運作方式都有些許不同。

還有一件事需要知道，那就是在使用迴圈時，保持程式碼的整潔變得非常重要。當你的程式碼有良好的視覺結構時，就能很容易看出發生了什麼事。但如果沒有，如果你忘記好好縮排，或者把縮排弄得亂七八糟，事情很快就會變得令人困惑。所以在這門課程裡，我們有一個不變的規則。你必須永遠把開頭的大括號放在與`repeat`敘述（英語：_statement_）同一行。你必須永遠把結尾的大括號單獨放在敘述之後的一行，並且永遠將它們之間的程式碼縮排兩個空格。這樣一來，所有的東西都會保持得非常整潔。如果你忘記了，或是試圖使用不同的寫法，你就會得到一個錯誤。

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/multiple-things-in-loop.webp"
  alt="Jiki 指著縮排和換行，這些能讓迴圈的程式區塊保持整潔"
  width="500"
  height="398"
/>
