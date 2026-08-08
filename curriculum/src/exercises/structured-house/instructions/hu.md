---
title: "Strukturált ház"
description: "Egy egész házat rajzolj meg két mérethoronyból kiindulva."
en_md5: 783a94e5de5f4bd22cd634e07eabc131
---

A feladatod egy házat rajzolni, úgy, hogy az egész rajzot csupán két horgonyváltozóból építed fel: `houseWidth` (házszélesség) és `houseHeight` (házmagasság).

Mi már beállítottuk neked a színeket, a vászon szélességét és a két horgonyváltozót. Minden mást (hogy hol helyezkedik el a ház, a tető, az ablakok, az ajtó és a gomb) a két horgonyból és az alábbi rögzített tényekből kell származtatnod.

**Arányokban gondolkodj!** Ha jól csinálod, elég csak a `houseWidth` és `houseHeight` értékét megváltoztatnod, és az egész ház arányosan átméreteződik: vízszintesen középen marad, a fűben áll, és megtartja az arányait. Ne kódold be kézzel a kiszámolt pozíciókat! Inkább építsd fel az egyes elemeket a horgonyváltozókból.

<img src="/static/images/exercise-assets/structured-house/structured-house-finished.webp" alt="Ugyanaz a ház három különböző szélességgel és magassággal megrajzolva, mindegyik vízszintesen középen marad, és a fűben áll" style="width: 100%; box-sizing: border-box; padding: 16px; background: #fff; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

### A ház specifikációja

- A rajzvászon bal felső sarka `0,0`. A jobb alsó sarka `100,100`.
- Az ég betölti a vásznat (`0,0`-tól `100,100`-ig).
- A fű teljes szélességű, és a vászon alján helyezkedik el `15` magassággal.
- A ház mindig vízszintesen középen van a vásznon.
- A ház alja `5`-tel a fű felső széle alatt van, és a ház onnan felfelé épül.
- A tető a keret fölé kerül. A keret bal és jobb oldalán a keret szélességének `1/10`-ével túlnyúlik, a magassága a keret magasságának `1/2`-e, és a csúcsa vízszintesen középen van.
- Az ablakok szélessége egyenként a keret szélességének `1/5`-e, magasságuk a keret magasságának `1/3`-a. A keret tetejéhez képest `1/8`-nyival lejjebb, a keret bal és jobb szélétől pedig `1/7`-nyival beljebb helyezkednek el.
- Az ajtó szélessége a keret szélességének `1/5`-e, magassága a keret magasságának `1/2`-e, vízszintesen középen van, és az alja a ház aljához igazodik.
- Az ajtógomb sugara az ajtó szélességének `1/10`-e. A gomb és az ajtó jobb széle között az ajtó szélességének `1/10`-nyi hézag van. A gomb függőlegesen az ajtó közepén helyezkedik el.

### Ellenőrizd, hogy működik!

Próbáld megváltoztatni a `houseWidth` és `houseHeight` változók értékét. Ha a kódod helyes, a ház átméreteződik, miközben vízszintesen középen marad, és a fűben áll.
