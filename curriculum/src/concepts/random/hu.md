---
title: "Véletlenszámok"
description: "A `Math.randomInt` használata egy minimummal és egy maximummal, hogy a függvény minden futáskor más számot adjon vissza."
en_md5: 3702104be1f36723a9604abbe2336863
---

A programozásban gyakran szeretnénk úgy használni egy függvényt (function), hogy minden alkalommal más véletlenszámot kapjunk tőle vissza.

Ez rengeteg helyzetben jól jön, de különösen a kriptográfiában, vagyis a titkosítás világában. Ott gyakran készítünk például kódokat, amelyeket gépek osztanak meg egymás között, és ezeknek a kódoknak véletlenszerűnek kell lenniük, hogy ne lehessen feltörni őket.

Ehhez rendelkezésedre áll egy `Math.randomInt` nevű függvény. Talán feltűnt, hogy a közepén egy pont van. Ahogy egyre több függvényhez férsz hozzá, a rend kedvéért csoportokba rendezzük őket, és a `Math` annak a csoportnak a neve, amelyikhez ez a függvény tartozik. Ez mondja meg Jikinek, hogy a polcok melyik részlegén keressen, ebben az esetben a `Math` részlegen. A pont egyszerűen annyit jelent: menj ehhez a részleghez, és keresd meg ott a függvényt. Emiatt most ne aggódj túl sokat, a feladatok leírása mindig megmondja, milyen függvények érhetők el, és hogyan kell használni őket. A lényeg, hogy amikor Jiki ezt a függvényt használja, minden futtatáskor más számot kap tőle, egyetlen megkötéssel. A függvénynek két bemenete (input) van. Az első a legkisebb szám, amit a gép visszaadhat, a második pedig a legnagyobb. Ha tehát a `Math.randomInt` függvényt a 10 és a 13 értékekkel használod, mindig 10-et, 11-et, 12-t vagy 13-at kapsz vissza. De minden alkalommal másikat.

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

Képzeld el például, hogy egy kört szeretnél rajzolni a rajzvászon (canvas) egy véletlenszerű pontjára. A `Math.randomInt` segítségével minden futáskor más értéket kaphatsz a bal és a felső pozícióhoz, mondjuk 10 és 90 közötti határokkal, hogy a kör soha ne lógjon ki a vászonról. Így valahányszor lefuttatod ezt a kódot, a kör mindig egy kicsit máshol jelenik meg.
