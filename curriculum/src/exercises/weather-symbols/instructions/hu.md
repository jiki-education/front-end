---
title: "Időjárás-szimbólumok"
description: "Rajzolj hatnapos időjárás-előrejelzést leírások listájából."
en_md5: 18bc1bf16ffc94d81bfa81a93faa9a7f
---

Azt a feladatot kaptad, hogy készíts egy hatnapos időjárás-előrejelzést. A főnököd viszont nem hagyományos időjárási adatokat ad, hanem olyan leírásokat, amelyek azt tükrözik, ő hogyan éli meg az adott időjárást (például "Snowboarding time! 🏂" vagy "Miserable 😩").

Kapsz egy _Array_-t (tömb), benne hat időjárás-leírással, naponta eggyel. A feladatod, hogy mindegyik nap időjárását berajzold a saját dobozába.

Az előrejelzés hat dobozból álló rácsként jelenik meg, hétfőtől szombatig minden napra egy-egy dobozzal. A leírások sorban követik egymást: az első (a `0`-s doboz) a hétfői időjárás, a második (az `1`-es doboz) a keddi, és így tovább egészen szombatig (az `5`-ös doboz). (A főnököd vasárnap ki sem mozdul otthonról, ezért aznap az időjárás nem is érdekli, így azt sosem jelezzük előre...)

## Egy nap megrajzolása

Adtunk neked egy `draw` (rajzol) függvényt, amely az összes rajzolást elvégzi helyetted. A te dolgod csak annyi, hogy kitaláld, milyen elemek kerüljenek bele.

```js
draw(box, day, elements)
```

- a `box` a doboz, amelybe rajzolsz (`0`-tól `5`-ig).
- a `day` a nap neve, amellyel a doboz feliratozva lesz, például `"Monday"`.
- az `elements` egy Array a megjelenítendő időjárás-szimbólumokkal (részletek lentebb).

A napok sorrendben: `"Monday"`, `"Tuesday"`, `"Wednesday"`, `"Thursday"`, `"Friday"` és `"Saturday"`.

Ha tehát az első nap `"Exciting 🤩"`, ezt írod:

```js
draw(0, "Monday", ["cloud", "snow"])
```

## Mit jelentenek a leírások

Minden leíráshoz egy meghatározott, szimbólumokból álló Array tartozik:

- `"Sunny ☀️"`: `["sun"]`
- `"Dull 😴"`: `["cloud"]`
- `"Miserable 😩"`: `["cloud", "rain"]`
- `"Hopeful 🤞"`: `["sun", "cloud"]`
- `"Rainbow territory! 🌈"`: `["sun", "cloud", "rain"]`
- `"Exciting 🤩"`: `["cloud", "snow"]`
- `"Snowboarding time! 🏂"`: `["sun", "cloud", "snow"]`

## A te feladatod

Menj végig a `days` listán napról napra. Minden leírást alakíts át a megfelelő szimbólumlistává, és a `draw` segítségével rajzold be az adott nap dobozába, a hozzá tartozó nap nevével feliratozva.
