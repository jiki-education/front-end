---
title: "Digitális gyök"
description: "Számítsd ki egy szám digitális gyökét a számjegyei ismételt összeadásával."
en_md5: 9847d9ea8c4a86ad65869e4f7b4c718e
---

Egy szám digitális gyöke (_digital root_ angolul) az, amit akkor kapsz, amikor addig adod össze a számjegyeit, amíg már csak egyetlen számjegy marad.

Ha a számjegyek egyszeri összeadása után még mindig több számjegyből álló eredményt kapsz, akkor ennek az eredménynek a számjegyeit adod össze, és ezt addig folytatod, amíg egyetlen számjegy nem marad.

Például a `942` digitális gyökének kiszámításához:

```
9 + 4 + 2 = 15
1 + 5 = 6
```

Tehát `942` digitális gyöke `6`.

Egy olyan szám, amely már eleve egyjegyű (például `7`), önmaga digitális gyöke.

Hozz létre egy `digitalRoot` nevű függvényt, amely egy számot fogad, és visszaadja annak digitális gyökét.

### A `String()` függvény

Az utóbbi pár leckében hozzáférhettél a `Number(str)` függvényhez, amely egy stringet számmá alakít.

Ugyanezt fordítva is megteheted, és a `String(num)` függvénnyel egy számot stringgé alakíthatsz. Például:

```js
String(147) === "147"
```

Figyeld meg, hogy itt is nagy kezdőbetűvel írjuk, és egyelőre ne törődj az okával!

### A tanultak gyakorlatba ültetése

Bár ezt a feladatot sokféleképpen meg lehet oldani, a megoldás, amit szeretnénk, ha kitalálnál, egy `while` ciklust használ.

Jó szórakozást!
