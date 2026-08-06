---
title: "Relációs Nap"
description: "Egy nap elhelyezése, ahol minden adat változókból számítódik."
en_md5: d8de4704a25f3733ddaaea16f0232005
---

Ebben a feladatban a feladatod egy napot elhelyezni az égbolt jobb felső sarkában, aritmetikát és változókat használva. A legfontosabb megkötés, hogy a nap széle mindig ugyanakkora **hézag**ra legyen a vászon szélétől, függetlenül attól, mekkora a nap.

A fájl tetején előre beállítottunk négy változót (_variables_ angolul) a számodra:

- `canvasSize` (vászonméret): a vászon mérete, ami `100`.
- `color` (szín): értéke `"yellow"`.
- `gap` (hézag): milyen messze van a nap széle a vászon tetejétől és jobb szélétől.
- `radius` (sugár): a nap sugara.

### Kétlépéses folyamat

A feladat megoldásához két dolgot kell tenned:

#### 1. Származtatott változók definiálása

Definiálj egy `sunX` (a nap x-koordinátája) és egy `sunY` (a nap y-koordinátája) változót, amelyek a `gap`, a `radius` és a `canvasSize` felhasználásával a nap középpontját a jobb felső sarokba helyezik.

#### 2. Rajzold meg a kört

Rajzolj egy kört a `sunX`, `sunY`, `radius` és `color` változók segítségével.

## Rugalmasság

A `gap` alapértelmezetten 10, a `radius` pedig 15. Először ezekkel oldd meg a feladatot, hogy a háttér segítségével igazíthasd a dolgokat. Ha a kódod helyes, a kör a megfelelő helyen jelenik meg az oldalon.

Ahhoz azonban, hogy a feladatot teljesítsd, nem elég „beégetni” az értéket (azaz egyetlen számra beállítani), a `sunX` és a `sunY` értékét más változókkal végzett számításoknak kell meghatározniuk.

Miután teljesítetted a feladatot, kattints a „Rendezd a kódom” gombra, és próbáld megváltoztatni a `gap` és a `radius` értékét a fájl tetején, majd futtasd újra a kódot, hogy lásd, ahogy a nap nő vagy elmozdul, de a sarokban marad.

Ha végeztél, kattints a jobb felső sarokban lévő „Irányítópult” gombra, hogy a szokásos módon folytasd.
