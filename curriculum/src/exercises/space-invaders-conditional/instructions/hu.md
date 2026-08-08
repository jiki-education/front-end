---
title: "Space Invaders: Feltételes"
description: "Csak akkor lőj, ha űrlény van a célkeresztedben."
en_md5: 4a603e339af722e912ab2ff9b25cc287
---

Az űrlények megváltoztatták a formációjukat! Most két sorban helyezkednek el, de nem minden oszlopban van űrlény.

Három függvényed van:

- A `move()` (elmozdul) egy pozícióval jobbra mozgatja a lézerágyúdat.
- A `shoot()` (lő) felfelé lövi a lézert.
- Az `isAlienAbove()` (van-e fölötte űrlény) `true`-t ad vissza, ha van fölötted űrlény, `false`-t, ha nincs.

Végig kell menned a képernyőn, és minden pozíciót ellenőrizned. Ha űrlény van fölötted, lődd le! Ha nincs, csak menj tovább.

**Ne lőj, ha nincs fölötted űrlény, különben veszítesz!**
