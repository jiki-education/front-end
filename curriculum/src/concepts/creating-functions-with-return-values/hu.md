---
title: "Visszatérési érték hozzáadása a függvényekhez"
description: "A return kulcsszóval kimeneti csúszdát adhatsz a saját függvényeidnek, amely egy értéket ad vissza a hívónak."
en_md5: 18e866d6b272081decc2a9765cd72fd7
---

Már tudod, hogyan hozz létre függvényeket (function) bemenettel (input) és bemenet nélkül. Egyetlen dolog maradt hátra, és utána a függvénykészítés igazi mesterévé válsz: meg kell tanulnod, hogyan adj a függvényeidnek kimeneti csúszdát.

Sok olyan függvényt használtál már, amely visszaad valamit. Az `isAlienAbove` igazat vagy hamisat ad vissza. A `Math.randomInt(1, 10)` egy véletlen számot ad vissza.

Amikor Jiki ezeket a függvényeket használja, a kimeneti csúszdán kipottyan valami, amit aztán fel tud használni.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-return-values/output-chute.webp"
  alt="Jiki elkap egy értéket, amint az kipottyan a gép kimeneti csúszdáján"
  width="500"
  height="312"
/>

Ehhez egy újabb kulcsszóra (keyword) lesz szükségünk, ez pedig a `return`.

A `return` kulcsszó azt mondja Mini Jikinek, hogy toljon ki valamit a kimeneti csúszdán.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-return-values/return-keyword-push.webp"
  alt="Mini Jiki a gép belsejében kitol egy 42-es értéket a kimeneti csúszdán"
  width="500"
  height="335"
/>

Készítsünk hát egy függvényt, és nevezzük el `meaningOfLife`-nak! Ennek a függvénynek az a dolga, hogy mindig a 42-es számot adja vissza. Bemenete nincs. Leírjuk, hogy `function meaningOfLife()`, a törzsébe pedig azt, hogy `return 42`.

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

Mostantól bárhol használjuk a kódban a `meaningOfLife()`-ot, a 42-es számot kapjuk vissza, és úgy használhatjuk, mint bármely más értéket. Betehetjük egy dobozba a `let` segítségével, átadhatjuk bemenetként egy másik függvénynek, vagy összehasonlíthatjuk egy elágazásban (if statement).

A visszatérési értékkel rendelkező függvények bemenetet is fogadhatnak. Írhatsz például egy `ageBracket(age)` függvényt, amely 18 év alatt azt adja vissza, hogy "Sorry, too young", egyébként pedig azt, hogy "Welcome". Aki meghívja, az azt a stringet (karakterláncot) kapja vissza, amelyet a függvény visszaadott.

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
