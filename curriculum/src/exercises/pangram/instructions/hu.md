---
title: "Pangram"
description: "Ellenőrizd, hogy egy mondat az ábécé minden betűjét tartalmazza-e, kis- és nagybetűtől függetlenül."
en_md5: 8fae2df6ec4385478e4236fa49e21256
---

Üdv a Pangram sorozat második részében! Emlékezz vissza: a pangram olyan mondat, amely az ábécé minden betűjét legalább egyszer tartalmazza.

Ez a feladat egy összetettebb változata annak a korábbi Pangram feladatnak, amit már megoldottál, mert itt nagybetűket is használunk. Ez meglepően sok bonyodalmat okoz.

Hozz létre egy `isPangram` (pangram?) nevű függvényt, amely egy mondatot kap stringként, és egy boolean-t ad vissza, ami megmondja, hogy a mondat pangram-e vagy sem.

Kiindulásként megkaptad a korábbi kódodat.

### Segédfüggvények

A meglévő segédfüggvényed mellett (amit javasoltunk, hogy `includes`-nak nevezz el) azt javasoljuk, hogy hozz létre két új segédfüggvényt, hogy megkönnyítsd a feladat megoldását. E függvények nevei szabványosak, és javasoljuk, hogy ragaszkodj hozzájuk:

1. `indexOf(haystack, needle)`: Egy függvény, ami kiszámítja, hogy **hol** található a tű a szénakazalban. Tehát ahelyett, hogy `true`/`false` értékkel térne vissza, mint az `includes`, a tű **indexét** adja vissza. Például az `indexOf("Jeremy", "r")` `2`-t adna vissza (ne feledd, hogy 0-tól számolunk).
2. `toLowerCase(someString)`: Egy függvény, ami egy stringet kap, és kisbetűsre alakítva adja vissza. Például a `toLowerCase("JeReMy")` eredménye `"jeremy"` lenne.

Jó szórakozást!
