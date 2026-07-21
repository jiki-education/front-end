---
title: "Függvények bemenetei"
description: "Értékeket teszünk a függvény bemeneti nyílásaiba, hogy minden futáskor mást és mást csináljon."
en_md5: 7228426ab443c2cf5c8d9e38dacf0130
---

A gépekben, vagyis a függvényekben (function) az az egyik legnagyszerűbb dolog, hogy sokukba információt is betehetsz, és ettől futáskor mást és mást csinálnak.

Eddig olyan gépeket láttunk, amik leginkább egy egyszerű dobozra hasonlítanak, mint például a move.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-inputs/move-machine.webp"
  alt="A move gép: egy sima doboz, bemeneti nyílások nélkül"
  width="322"
  height="400"
/>

Néhány gépen viszont nyílások is vannak, mint ezen a walk gépen. A walk gép majdnem ugyanolyan, mint a move: előre mozgatja a karaktert, csakhogy Jiki a nyílás segítségével azt is megadhatja, hány lépést menjen előre a karaktered. Így ahelyett, hogy a move függvényt háromszor egymás után használnád (move, move, move), elég egyszer használnod a walk függvényt, és megmondanod Jikinek, hogy tegye be a gépbe a hármas számot.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-inputs/walk-machine-slot.webp"
  alt="A walk gép, tetején egy bemeneti nyílással a lépések számának"
  width="481"
  height="400"
/>

Kódban ehhez továbbra is leírjuk a függvény nevét, ebben az esetben a walk-ot, és továbbra is kitesszük a nyitó zárójelet. A csukó zárójel előtt viszont megadjuk, hogy mi legyen a bemenet (input). Itt most azt szeretnénk, hogy a bemenet a három legyen, vagyis hogy a karakter három lépést sétáljon előre:

```javascript
walk(3)
```

Amikor Jiki ezt meglátja, fogja a hármas számot (képzeld el úgy, mint egy kis érmét), bedobja a gép bemeneti nyílásába, és csak utána húzza meg a kart, hogy elindítsa a gépet.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-inputs/jiki-coin-into-slot.webp"
  alt="Jiki a 3-as számot érmeként bedobja a walk gép nyílásába, majd meghúzza a kart"
  width="421"
  height="400"
/>

A téglalapokat és köröket rajzoló függvényeknél több különböző számot is meg kell adnod Jikinek: például hogy milyen messze legyen az alakzat a bal széltől, milyen messze a tetejétől, milyen széles és milyen magas legyen a téglalap.

Jiki világában ezek egyszerűen külön nyílások: mindegyik számnak jut egy.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-inputs/two-machines-inputs.webp"
  alt="A rectangle gép nyílásokkal a left, top, width és height értékeknek, mellette a circle gép nyílásokkal a cx, cy és radius értékeknek"
  width="396"
  height="400"
/>

A kódban ilyenkor egyszerűen egymás után írjuk a számokat, és vesszőt teszünk közéjük. Tehát: a függvény neve, egy nyitó zárójel, egy-egy szám minden bemenetnek vesszőkkel elválasztva, végül a csukó zárójel:

```javascript
rectangle(10, 20, 30, 40)
```

Ha egy függvényt nem a megfelelő számú bemenettel próbálsz használni, hibát kapsz. Ha például olyan gépbe próbálsz bemenetet tenni, amin nincs nyílás, Jiki szól, hogy ezt nem lehet. És ha egy olyan gépet használsz, amin van bemeneti nyílás, de nem mondod meg Jikinek, mit tegyen bele, akkor is megáll és reklamál. Ha egy kicsit lázadó kedvedben vagy, próbáld ki, és nézd meg, mi történik! Ahogy a dolgok egyre bonyolultabbak lesznek, rengeteg ilyen hibát fogsz még ejteni. Próbáld meg nem stresszelni miatta! Mindannyian a hibáinkból tanulunk, szó szerint így rögzíti az agyunk a leggyorsabban a dolgokat. És ilyen hibákat mindenki elkövet. Mindannyian nulláról indultunk, úgyhogy semmi pánik.

Még egy dolgot érdemes megemlíteni: a feladatokban néha olyan sorokat fogsz látni, amik két perjellel kezdődnek. Ezeket kommenteknek (comment) hívjuk. Csak neked szóló privát jegyzetek, amiket Jiki teljesen figyelmen kívül hagy. Ha Jiki egy két perjellel kezdődő sort lát, egyszerűen átlépi, és a következő sorral folytatja. A kommentekkel saját magadnak írhatsz jegyzeteket. Nagyon hasznosak, ha emlékeztetni akarod magad arra, hogyan működik valami. Gyakran előre megírt kommenteket is találsz: egy feladat elején megmutathatják, hova kell kódot írnod, vagy tippet adhatnak a megoldáshoz. De nyugodtan írd hozzá a sajátjaidat is.

A feladatok leírásának alján mindig megtalálod, milyen függvényeket használhatsz, és pontosan milyen bemeneteket kell megadnod nekik.
