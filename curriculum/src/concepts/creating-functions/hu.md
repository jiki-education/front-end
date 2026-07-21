---
title: "Saját függvények írása"
description: "A function kulcsszóval saját gépeket építhetsz, amelyeket Jiki a polcaira tesz, és bármikor újra felhasznál."
en_md5: 5f9e717ca07bb058d58a131472cecf3c
---

Eddig olyan függvényeket (function) használtál, amelyeket készen kaptál: ilyen a circle, a rectangle, a move right vagy a shoot. Ezek mind kész függvények, amelyek már ott várnak Jiki polcain.

Most viszont eljött az ideje, hogy elkezdd elkészíteni a saját függvényeidet.

Hogy megmutassuk, hogyan megy ez, építünk egy új függvényt a labirintushoz, `walk5` néven.

Ez a függvény mindig öt lépéssel viszi előre a karaktert. Bevallottan nem a világ leghasznosabb függvénye, de kezdésnek pont jó, mert szép egyszerű.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions/walk-grid.webp"
  alt="A karakter a labirintus rácsán, készen arra, hogy öt lépést tegyen előre"
  width="500"
  height="314"
/>

Ha most arra kérnélek, hogy írj kódot, ami öt lépéssel előre viszi a karaktert, kétféleképpen tehetnéd meg: vagy leírod ötször a move-ot, vagy használsz egy `repeat` ciklust (loop). Ebben a példában, hogy egyszerű maradjon, az ötször egymás után leírt move megoldást választjuk.

```javascript
move()
move()
move()
move()
move()
```

Tehát ennek kell majd a függvényünk belsejébe kerülnie.

Most írj alá egy sort, amivel megmondod Jikinek, hogy használja ezt a függvényt. Ezt már sokszor láttad.

Ezután az lesz a feladatunk, hogy ezt az első öt sort becsomagoljuk egy függvénybe, hogy amikor Jiki a walk5-öt használja, pontosan ez az öt sor fusson le.

Ahhoz, hogy ebből az öt sorból, ebből az öt move-ból függvény legyen, egy új kulcsszóra (keyword) lesz szükségünk: ez a `function` kulcsszó.

Amikor a function kulcsszót használjuk, két dolgot kell tennünk. Egy: megadjuk a függvény nevét, ebben az esetben ez a walk5. Kettő: kapcsos zárójelek (`{}`) közé zárjuk azt a kódot, amelyik azt mondja: „ezt kell csinálni a függvényen belül". Ha ezt hozzáadjuk a kódunkhoz, akkor most már azt mondjuk Jikinek, hogy hozzon létre egy walk5 nevű függvényt, és amikor valaki a walk5-öt használja, ezt az öt sort futtassa le.

```javascript
function walk5() {
  move()
  move()
  move()
  move()
  move()
}
```

Amikor Jiki meglátja a function kulcsszót, épít egy új gépet, a belsejében lévő táblára felírja ezeket az utasításokat, majd a gépre ráragaszt egy walk5 feliratú címkét. Ezután felteszi a gépet a polcra, az összes többi mellé.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions/jiki-machine-whiteboard.webp"
  alt="Jiki egy új gép mellett áll, amelynek belsejében egy tábla van a függvény utasításainak felírásához"
  width="500"
  height="396"
/>

Ebben az általad készített függvényben ráadásul semmi különleges nincs a beépítettekhez képest. Mind ugyanúgy egymás mellett sorakoznak Jiki polcain.

És amikor használod a függvényt, vagyis leírod, hogy `walk5()`, Jiki egyszerűen leveszi a gépet a polcról, és pontosan úgy használja, ahogy eddig bármelyik másik függvényt. Képzeld el, hogy minden gépben egy mini Jiki lakik. A mini Jikin mindig egy menő sapka van. És ez a mini Jiki pontosan ugyanúgy dolgozik, mint a kinti, normál Jiki: ugyanúgy követi az utasításokat.

Egy fontos dolgot érdemes itt megérteni: amikor Jiki létrehozza a függvényt, a kódot még nem futtatja le. Csak felírja, hogy később használhassa.

A labirintusban a karakter nem mozdul meg akkor, amikor leírod a function kulcsszót.

Jiki megépítette a gépet, és feltette a polcra. A karakter csak akkor indul el ténylegesen, amikor a `walk5()` leírásával megmondod Jikinek, hogy használja a gépet.
