---
title: "Hamming"
description: "Számold meg a két DNS-szál közötti különbségeket."
en_md5: 629f74899d402283c34d3bfbb17777b8
---

Ez egy klasszikus Exercism-feladat a molekuláris biológiáról!

A tested sejtekből épül fel, amelyek DNS-t tartalmaznak. Ezek a sejtek rendszeresen elhasználódnak és pótlásra szorulnak, amit úgy érnek el, hogy leánysejtekre osztódnak. Sőt, egy átlagos emberi test élete során körülbelül 10 kvadrillió sejtosztódáson megy keresztül!

Amikor a sejtek osztódnak, a DNS-ük is másolódik. Néha e folyamat során hibák történnek, és a DNS egyes darabjai hibás információval kódolódnak. Ha összehasonlítunk két DNS-szálat, és megszámoljuk a köztük lévő különbségeket, láthatjuk, hány hiba történt. Ezt nevezzük „Hamming-távolság”-nak.

A Hamming-távolság a tudomány számos területén hasznos, nem csak a biológiában, így jó, ha ismerjük ezt a fogalmat!

A feladatod, hogy kiszámítsd két DNS-szál Hamming-távolságát. A DNS a C, A, G és T betűket használja. Két szál így nézhet ki:

    GAGCCTACTAACGGGAT
    CATCGTAATGACGGCCT
    ^ ^ ^  ^ ^    ^^

Köztük 7 eltérés van, így a Hamming-távolság 7.

Hozz létre egy `hammingDistance` (hamming-távolság) nevű függvényt, amelynek két bemenete van: a két DNS-szál, stringként. Egy számot kell visszaadnia a távolságként.

A két DNS-szál mindig azonos hosszúságú lesz.
