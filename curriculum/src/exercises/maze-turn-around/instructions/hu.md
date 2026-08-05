---
title: "Megfordulás"
description: "Készíts egy megfordulás függvényt a labirintushoz!"
en_md5: bbb03498f3b5ec9956af463e85fde414
---

Az előző gyakorlatban kitaláltad, hogyan oldd meg a labirintust automatikusan. Nagyszerű munka!

Az egyik jó dolog a megoldásban, hogy a kód nagyon természetesen olvasható. Nagyon illeszkedik az algoritmushoz. Kivéve egy apróságot…

Nem érezted egy kicsit kevésbé elegáns megoldásnak, hogy kétszer kellett használnod a `turnLeft()` (fordulj balra) függvényt a megforduláshoz, ahelyett, hogy lenne egy `turnAround()` (fordulj meg) függvényed?

Nos, itt a lehetőséged, hogy kijavítsd ezt!

Hozz létre egy új függvényt `turnAround` néven a kódod elején. Nincsenek paraméterei és nem ad vissza semmit. Egyszerűen hívja meg a `turnLeft()` függvényt kétszer.

Ezután használd ezt a függvényt a megoldásban, a végső else utasításban.

Próbáld elérni, hogy a teljes végső program 17 soros legyen.
