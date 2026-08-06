---
title: "Skyline"
description: "Építsd fel egy egész város látképét véletlenszerű épületekből."
en_md5: cb89a31566f55397d19e1375dbac44cc
---

A Skyscraper feladatban egyetlen, különböző magasságú felhőkarcolót készítettél. Ezúttal továbblépünk, és egy városképet hozunk létre, ahol az épületek különböző magasságúak és szélességűek.

Van egy `numBuildings()` (épületek száma) függvényed, ami megmondja, hány épületet kell létrehoznod az adott forgatókönyvben. Ezen kívül van még a `randomWidth()` (véletlen szélesség) és a `randomNumFloors()` (véletlen emeletszám) függvény is. Ezekkel határozhatod meg az egyes épületek szélességét és emeleteinek számát az adott forgatókönyvben. Amikor először használod ezeket a függvényeket, az első épület értékeit adják vissza, amikor másodszor, a másodikét, és így tovább.

Az épületek bal oldalán 1 oszlopnyi hézag van, és közöttük is 1 oszlopnyi hézag van.

Tehát ha van egy forgatókönyv, ahol a `numBuildings()` 2-t ad vissza, a `randomWidth()` először 5-öt, majd 7-et ad vissza, a `randomNumFloors()` pedig először 4-et, majd 8-at, akkor ezt az elrendezést kapod (ahol az `xxxxx` a betonpadlót jelöli):

```
       WWWWWWW
       WGGGGGW
       WGGGGGW
       WGGGGGW
 WWWWW WGGGGGW
 WGGGW WGGGGGW
 WGGGW WGGGGGW
 WGGGW WGGGGGW
 WGEGW WGGEGGW
xxxxxxxxxxxxxxxxxxxxxxx
```
