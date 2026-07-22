---
title: "Aritmetika"
description: "Változók és matematika együtt: összeadással, kivonással, szorzással és osztással az értékek összekapcsolódhatnak és függhetnek egymástól."
en_md5: "8cc4ac13bdbdef01388413304e0af173"
---

Eddig amikor változókat (variable) hoztunk létre, csak egyszerű értékeket használtunk: egy számot, mondjuk az 50-et, vagy egy stringet (karakterláncot), például a yellow szót. A változók viszont akkor válnak igazán erőssé, amikor egymással kombinálva használjuk őket. Amikor például azt mondhatjuk, hogy a téglalap bal széle a vászon szélétől egy adott távolságra legyen.

A programozásban használhatjuk a megszokott, egyszerű matematikai műveleteket, az összeadást, kivonást, szorzást és osztást, és a már beállított változóinkat is bevonhatjuk a számolásba.

Kezdjük azzal, hogy szeretnénk egy téglalapot rajzolni a vászonra, mégpedig úgy, hogy bal és jobb oldalt 10-zel, fent és lent pedig 20-szal kezdődjön beljebb. Vagyis a vászon közepén lesz, és kicsit szélesebb, mint amilyen magas.

<img
  class="concept-image"
  src="/static/images/concept-assets/arithmetic/rectangle-on-canvas.webp"
  alt="Kék téglalap a vászon közepén, bal és jobb oldalt 10-zel, fent és lent 20-szal beljebb"
  width="399"
  height="400"
/>

Egy téglalap megrajzolásához tudnunk kell, hol van a bal széle (left) és a teteje (top), mekkora a szélessége (width) és a magassága (height), és azt is, milyen színű. Kezdésnek ezt le is írhatjuk.

Most pedig ki kell számolnunk, mennyi legyen a left, a top, a width és a height. Állítsuk be őket! A left 10. A top 20. A width, nos, a width a vászon mérete, ami 100, mínusz a 10 bal oldalt és a 10 jobb oldalt, vagyis 80. A height pedig a vászon magassága, ami szintén 100, mínusz a 20 fent és a 20 lent, tehát 60.

```javascript
let left = 10
let top = 20
let width = 80
let height = 60

rectangle(left, top, width, height, "blue")
```

Ezeket a változókat tehát be tudjuk állítani: left 10, top 20, width 80, height 60. De mi történik, ha beljebb akarjuk tolni a téglalapot, és kicsit kisebbre venni? Ha bal és jobb oldalt 20-szal, fent és lent 30-cal akarjuk beljebb tenni? Akkor mindent újra ki kell számolnunk. A width most 100 mínusz 20 mínusz 20, a height pedig 100 mínusz 30 mínusz 30, és ez bizony több munka és több számolás, mint amennyit szívesen vállalnék. Ehelyett inkább bízzuk a számítógépre!

Beállíthatjuk a width-et úgy, hogy 100 mínusz left mínusz left, a height-et pedig úgy, hogy 100 mínusz top mínusz top, hiszen fent és lent ugyanannyi. Vagy írhatjuk így is: 100 mínusz left szorozva kettővel, illetve 100 mínusz top szorozva kettővel.

```javascript
let width = 100 - left * 2
let height = 100 - top * 2
```

Mostantól ha megváltoztatjuk a left vagy a top értékét, a width és a height is vele változik. A dolgok tehát kezdenek összefüggeni egymással. És mi a helyzet a vászonnal? Az most 100. De mi van, ha a vásznunk egyszer 200 széles és magas lesz? Nos, érdemes létrehozni egy canvasSize nevű változót, és beállítani 100-ra. Így a width már canvasSize mínusz left szorozva kettővel, a height pedig canvasSize mínusz top szorozva kettővel.

```javascript
let canvasSize = 100
let left = 20
let top = 30
let width = canvasSize - left * 2
let height = canvasSize - top * 2

rectangle(left, top, width, height, "blue")
```

Gondoljuk végig, mit csinál Jiki, amikor leírjuk, hogy a height legyen canvas mínusz top szorozva kettővel. Először leveszi a polcról a top dobozt, és 20-at talál benne. Előveszi a zsebszámológépét, kiszámolja, hogy 20-szor 2 az 40, és ezt fejben megjegyzi.

<img
  class="concept-image"
  src="/static/images/concept-assets/arithmetic/flow-of-images-1.webp"
  alt="Jiki leveszi a top dobozt a polcról, és kiszámolja, hogy 20-szor 2 az 40"
  width="377"
  height="400"
/>

Ezután leveszi a polcról a canvas dobozt, abban 100-at talál, és kiszámolja, hogy 100 mínusz 40 az 60. Innentől már tudja, hogy valójában azt mondjuk: a height legyen 60. Engedelmeskedik hát a let-nek: fog egy új dobozt, ráírja, hogy height, és beleteszi a 60-at. Amikor pedig később használjuk a height-et, egyszerűen kiveszi belőle a 60-at.

<img
  class="concept-image"
  src="/static/images/concept-assets/arithmetic/flow-of-images-3.webp"
  alt="Jiki fog egy új dobozt, ráírja, hogy height, és beleteszi a 60-at"
  width="462"
  height="400"
/>

Amikor egy feladatban már minden működik, játssz egy kicsit a változók értékeivel, és figyeld meg, mi történik! Nézd, hogyan nőnek és hogyan zsugorodnak a dolgok. Szánj rá időt, és gondold át, hogyan függenek össze egymással.
