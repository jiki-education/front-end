---
title: "Tőzsde"
description: "Kövesd nyomon a befektetésed, miközben a tőzsde véletlenszerűen emelkedik és csökken."
en_md5: 233edb21475a3846a567f3bdda98ce84
---

Az idei év január elsején befektettél a kemény munkával megkeresett 10 dollárodat a tőzsdére. Úgy döntöttél, titokban tartod a családod előtt, és csak 20 év múlva árulod el, amikor (remélhetőleg!) sokat ér majd.

Három dolgot kell tudni a tőzsdéről:

1. Kiszámíthatatlanok. Évente növekedhetnek vagy csökkenhetnek. Átlagosan körülbelül 10%-kal nőnek, de ez drámaian változhat.
2. Ahogy nőnek, a pénzed a kamatos kamat miatt gyorsabban nő, mint a tőzsde. Ha idén befektetsz 10 dollárt, és a tőzsde értéke megduplázódik 10 év alatt, 20 dollárod lesz. Ha az azt következő 10 évben ismét megduplázódik, 40 dollárod lesz (20 $ \* 2, nem 10 $ \* 2!).
3. Amikor profitot termelsz, be kell jelentened az adóhivatalnak!

### A feladat menete

Van egy függvényed, a `marketGrowth(year)` (piaci növekedés), ami visszaadja, hogy a tőzsde hány százalékkal nőtt az adott évben (például `5` azt jelenti, hogy `5%`-kal nőtt). Tehát ha befektetsz 10 dollárt, és 5%-kal nő, akkor most 10,50 dollárod van.

A feladatod, hogy nyomon kövesd, mennyi pénzed van évente, és jelentsd az adóhivatalnak a `reportTax(year, balance)` (adóbejelentés) segítségével. Majd 20 év után jelentsd be a családodnak a végső összeget a `announceToFamily(value)` (családi bejelentés) használatával. Az első `marketGrowth(...)` év az aktuális év legyen.

További részletekért nézd meg az alábbi függvényeket, és ha elakadsz, mindig megnézheted a tippeket!
