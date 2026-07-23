---
title: "Visszatérési érték hozzáadása a függvényekhez"
description: "A `return` kulcsszóval kimeneti csúszdát adhatsz a saját függvényeidnek, amely egy értéket ad vissza a hívónak."
en_md5: 82630650eb68508771ea5b29baad9b67
---

Már tudod, hogyan hozz létre függvényeket bemenettel és bemenet nélkül. Egyetlen dolog maradt hátra, és utána a függvénykészítés igazi mesterévé válsz: meg kell tanulnod, hogyan adj a függvényeidnek kimeneti csúszdát.

Sok olyan függvényt használtál már, amely visszaad valamit. Az `isAlienAbove` (van-e felettünk űrlény) igazat vagy hamisat ad vissza. A `Math.randomInt(1, 10)` (a `Math` a matematikát jelenti, a `randomInt` pedig a véletlen egész számot) egy véletlen számot ad vissza.

Amikor Jiki ezeket a függvényeket használja, a kimeneti csúszdán kipottyan valami, amit aztán fel tud használni.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-return-values/output-chute.webp"
  alt="Jiki elkap egy értéket, amint az kipottyan a gép kimeneti csúszdáján"
  width="500"
  height="312"
/>

Ehhez egy újabb kulcsszóra lesz szükségünk, ez pedig a `return`.

A `return` kulcsszó azt mondja Mini Jikinek, hogy toljon ki valamit a kimeneti csúszdán.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-return-values/return-keyword-push.webp"
  alt="Mini Jiki a gép belsejében kitol egy 42-es értéket a kimeneti csúszdán"
  width="500"
  height="335"
/>

Készítsünk hát egy függvényt, és nevezzük el `meaningOfLife`-nak (az élet értelme)! Ennek a függvénynek az a dolga, hogy mindig a `42`-es számot adja vissza. Bemenete nincs. Leírjuk, hogy `function meaningOfLife()`, a törzsébe pedig azt, hogy `return 42`.

```javascript
function meaningOfLife() {
  return 42
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-return-values/meaning-of-life-42.webp"
  alt="A meaningOfLife gép a 42-es számot küldi ki a kimeneti csúszdáján"
  width="500"
  height="323"
/>

Mostantól bárhol használjuk a kódban a `meaningOfLife()`-ot, a `42`-es számot kapjuk vissza, és úgy használhatjuk, mint bármely más értéket. Betehetjük egy dobozba a `let` segítségével, átadhatjuk bemenetként egy másik függvénynek, vagy összehasonlíthatjuk egy elágazásban.

A visszatérési értékkel rendelkező függvények bemenetet is fogadhatnak. Írhatsz például egy `ageBracket(age)` (korosztály) függvényt, amely azt adja vissza, hogy `"Sorry, too young"`, ha az `age` 18 alatt van, egyébként pedig azt, hogy `"Welcome"`. Aki meghívja, az azt a stringet kapja vissza, amelyet a függvény visszaadott.

```javascript
function ageBracket(age) {
  if (age >= 18) {
    return "Welcome"
  }
  return "Sorry, too young"
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-return-values/age-input.webp"
  alt="Egy életkorérték a gép bemeneti nyílásába pottyan, hogy a gép eldönthesse, mit adjon vissza"
  width="487"
  height="400"
/>

Lényegében így működik a programozás: sok ilyen kis építőelemet készítünk, majd programokká illesztjük össze őket.
