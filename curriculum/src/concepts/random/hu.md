---
title: "Véletlenszámok"
description: "A `Math.randomInt` használata egy minimummal és egy maximummal, hogy a függvény minden futáskor más számot adjon vissza."
en_md5: 5f41de1ca5327be4a86a69d801f1b6f9
---

A programozásban gyakran szeretnénk úgy használni egy függvényt, hogy minden alkalommal más véletlenszámot (_random number_ angolul) kapjunk tőle vissza.

Ez rengeteg helyzetben jól jön, de különösen a kriptográfiában, vagyis a titkosítás világában. Ott gyakran készítünk például kódokat, amelyeket gépek osztanak meg egymás között, és ezeknek a kódoknak véletlenszerűnek kell lenniük, hogy ne lehessen feltörni őket.

Ehhez rendelkezésedre áll egy `Math.randomInt` nevű függvény (a `Math` a matematikára, a `randomInt` pedig a véletlen egész számra utal). Talán feltűnt, hogy a közepén egy pont van. Ahogy egyre több függvényhez férsz hozzá, a rend kedvéért csoportokba rendezzük őket, és a `Math` (a matematika rövidítése) annak a csoportnak a neve, amelyikhez ez a függvény tartozik. Ez mondja meg Jikinek, hogy a polcok melyik részlegén keressen, ebben az esetben a `Math` részlegen. A pont egyszerűen annyit jelent: menj ehhez a részleghez, és keresd meg ott a függvényt. Emiatt most ne aggódj túl sokat, a feladatok leírása mindig megmondja, milyen függvények érhetők el, és hogyan kell használni őket. A lényeg, hogy amikor Jiki ezt a függvényt használja, minden futtatáskor más számot kap tőle, egyetlen megkötéssel. A függvénynek két bemenete van. Az első a legkisebb szám, amit a gép visszaadhat, a második pedig a legnagyobb. Ha tehát a `Math.randomInt` függvényt a `10` és a `13` értékekkel használod, mindig `10`-et, `11`-et, `12`-t vagy `13`-at kapsz vissza. De minden alkalommal másikat.

<img
  class="concept-image"
  src="/static/images/concept-assets/random/jiki-shelves-math.webp"
  alt="Jiki egy létrán mászik fel a raktárpolcai Math részlegéhez"
  width="440"
  height="400"
/>

```javascript
Math.randomInt
```

<img
  class="concept-image"
  src="/static/images/concept-assets/random/function-two-inputs.webp"
  alt="A Math.randomInt gép, tetején két bemeneti tölcsérrel"
  width="500"
  height="378"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/random/function-10-13.webp"
  alt="A Math.randomInt gép a bemeneti tölcséreiben a 10-zel és a 13-mal, kimenetként 10-et, 11-et, 12-t vagy 13-at adva"
  width="488"
  height="400"
/>

Képzeld el például, hogy egy kört szeretnél rajzolni a rajzvászon egy véletlenszerű pontjára. A `Math.randomInt` segítségével minden futáskor véletlenszerűen más értéket adhatsz a `left`-nek és a `top`-nak, mondjuk `10` és `90` közötti határokkal, hogy a kör soha ne lógjon ki a vászonról. Így valahányszor lefuttatod ezt a kódot, a kör mindig egy kicsit máshol jelenik meg.
