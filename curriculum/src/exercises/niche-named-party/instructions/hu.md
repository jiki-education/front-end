---
title: "Exkluzív névparti"
description: "Derítsd ki, ki juthat be egy nagyon exkluzív partira."
en_md5: 3c03097aed9465c8f132574b033ad7ce
---

A mai esti parti nagyon exkluzív – csak azok mehetnek be, akiknek a neve egy megadott betűsorral kezdődik!

A te dolgod, hogy írj egy `handleGuest` (vendég kezelése) nevű függvényt, amely két bemenetet fogad:

- `name` – az ajtóban álló személy neve
- `allowedPrefix` – a mai esti partihoz szükséges kezdőbetűk

A függvény `true` értéket adjon vissza, ha a személy beléphet, és `false`-t, ha el kell küldeni.

Például:

- Ha a mai esti előtag `"S"`, akkor Sarah bejut (`true`-t ad vissza), Brad viszont nem (`false`-t ad vissza).
- Ha az előtag `"Brad"`, akkor Brad és Bradley bejut, Brian viszont nem.

### Segédfüggvények

Ahogy haladsz ezzel a feladattal, szükséged lesz rá, hogy meghatározd a vendég nevének hosszát, és az előtag hosszát is. Ez a tökéletes alkalom, hogy létrehozz egy `getLength(someString)` nevű segédfüggvényt, amely megszámolja, hány betűből áll a string. Ezt a függvényt aztán a `handleGuest(...)`-en belül több helyen is felhasználhatod.

A bónusz forgatókönyv kihívása, hogy oldd meg a feladatot a lehető legkevesebb sorban. Találhatsz más megoldásokat is, amik több sort használnak, és ez teljesen rendben van (bátorítunk is, hogy fedezz fel különböző megközelítéseket), de próbáld meg megtalálni a legrövidebb verziót is.

Jó szórakozást!
