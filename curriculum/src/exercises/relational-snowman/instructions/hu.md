---
title: "Relációs hóember"
description: "Építsd újra a hóembert úgy, hogy minden mérete egyetlen változóból legyen kiszámítható."
en_md5: 1753f8d873e9a5b58885cc1daee5ea5d
---

Ebben a feladatban egy újabb hóembert építünk, és hasonlóan az előző feladathoz, úgy csináljuk, hogy minden egyetlen `size` (méret) változóból legyen származtatható számtani kifejezésekkel.

A választott `size`-től függően a hóembernek növekednie kell.

<img
  src="/static/images/exercise-assets/relational-snowman/sizes.webp"
  alt="Hóember 1-től 5-ig tartó méretekben"
  style="width: 100%; max-width: 600px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;"
/>

### Hogyan működik

- A rajzvászon bal felső sarka `0,0`. A jobb alsó sarka `100,100`.
- Rendelkezésedre áll egy előre megírt `snowmanX` (hóember X koordinátája) változó, ami a kép közepét adja meg, valamint egy `size` (méret) változó, amit `1`-től `5`-ig változtathatsz, hogy a hóember nőjön.
- Az összes többi változót számtani kifejezésekkel kell származtatnod.
- A fej sugara `size * 2`, a test sugara `size * 3`, az alap sugara `size * 4`.
- A köröknek érintkezniük kell egymással: a test közvetlenül az alap felett helyezkedik el, a fej pedig közvetlenül a test felett. (A hóemberünk kissé ingatagabb, mint a korábbi feladatokban - minden hógolyó pontosan az alatta lévőre van helyezve anélkül, hogy beleolvadnának. Bizonyára nagyon hideg nap van!)
- Az alapkör alja `size` távolságra van az alsó széltől.
- Ki kell számolnod mindhárom hógolyó középpontját.

### Változók

A feladatod, hogy a fenti utasítások alapján beállítsd ezeket a változókat:

- `headRadius` (fej sugara): Vezesd le a `size`-ból.
- `bodyRadius` (test sugara): Vezesd le a `size`-ból.
- `baseRadius` (alap sugara): Vezesd le a `size`-ból.
- `baseY` (alap y koordinátája): Vezesd le a `size`-ból és a `baseRadius`-ból (az alap a talajon áll).
- `bodyY` (test y koordinátája): Vezesd le a `baseY`, `baseRadius` és `bodyRadius` alapján.
- `headY` (fej y koordinátája): Vezesd le a `bodyY`, `bodyRadius` és `headRadius` alapján.

### Játssz a mérettel

A `size`-t `1` és `5` között változtathatod, és a hóembernek nőnie kell. Ne feledd, miután megváltoztattad, kattints a „Kód futtatása” gombra.
