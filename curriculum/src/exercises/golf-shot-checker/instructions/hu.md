---
title: "Ütés-ellenőrző"
description: "Ellenőrizd, hogy a golfütés elég közel landolt-e ahhoz, hogy a labda a lyukba kerüljön."
en_md5: 0585e8c489eca5a11da4df955e647456
---

Üdv újra a golfpályán! Eddig csak vízszintesen gurítottad a labdát. Amikor elérted a lyukat, a labda egyszerűen fölötte állt meg. Most viszont ténylegesen le is animáljuk, ahogy beleesik a lyukba.

Az első változás, hogy a `moveTo` (elmozdul) függvény most már `x` (vízszintes pozíció) és `y` (függőleges pozíció) bemenettel rendelkezik. Ugyanúgy, mint eddig, lépésről lépésre kell gurítanod, nem csak egyből a végére ugranod. De ezúttal, ha a golfozó a labdát a lyukba juttatja, ezt a végső részt is animálnod kell: miután a labda elérte a megfelelő helyet, le kell mozgatnod a lyukba.

Végül, **ha a labda a lyukba érkezett**, miután legurult az aljára, itt az ideje ünnepelni, úgyhogy lőj ki némi tűzijátékot a `fireFireworks()` (tűzijátékot indít) függvény segítségével.

Néhány dolog, amit tudnod kell:

1. A labda a tee-ről indul, `x = 28`, `y = 75` pozícióból, és lépésenként gurul.
2. Egy sikeres ütés azt jelenti, hogy az ütés hossza `58`, `59`, `60`, `61` vagy `62`.
3. Le kell gurítanod a labdát `9` egységgel.

Ebben a feladatban próbálj meg minden lépést alaposan átgondolni, és haladj lépésről lépésre. Sok sikert!
