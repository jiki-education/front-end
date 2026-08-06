---
title: "Collatz-sejtés"
description: "Fedezz fel egy híres matematikai rejtvényt a saját függvényeddel."
en_md5: e4f7ab61c163cdb7c2eb2b6541a2cedc
---

Egy este rábukkantál egy régi jegyzetfüzetre, amely tele volt rejtélyes firkálmányokkal, mintha valaki megszállottan kergetett volna egy gondolatot. Az egyik oldalon egyetlen kérdés emelkedett ki: **Vajon minden szám el tud jutni 1-ig?** Ez a **Collatz-sejtéshez** kapcsolódott, egy olyan rejtvényhez, amely évtizedek óta zavarba hozza a gondolkodókat.

A szabályok megtévesztően egyszerűek:

1. Válassz egy számot.
2. Ha páros, oszd el 2-vel.
3. Ha páratlan, szorozd meg 3-mal, és adj hozzá 1-et.
4. Ismételd meg az eredménnyel, és folytasd a végtelenségig.

Például 12-vel kezdve:

```
12 → 6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1
```

A második számtól (a 6-tól) számolva 9 lépés kellett az 1 eléréséhez.

Hozz létre egy `collatzSteps` (collatz-lépések) nevű függvényt, amely bemenetként egy számot vár. Add vissza, hogy **hány lépés** szükséges ahhoz, hogy egy tetszőleges számból eljussunk 1-ig, a Collatz-sejtés szabályait követve.
