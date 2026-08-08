---
title: "Csíkos szövet"
description: "Csíkos mintát szősz az egyes csíkok színének helyes megválasztásával."
en_md5: ba93b39f1883d50139d243a16e3c204f
---

Egy csíkos anyagtekercset létrehozó algoritmust tervezel, ami így néz ki:

<svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="Húsz függőleges csík: mindkét végén lila, közöttük zöld, kék és sárga csíkok váltakoznak." style="width: 200px; height: 200px; display: block; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;padding:4px;margin-top:-8px">
  <rect x="0" y="0" width="5" height="100" fill="#A020F0" />
  <rect x="5" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="10" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="15" y="0" width="5" height="100" fill="#008000" />
  <rect x="20" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="25" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="30" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="35" y="0" width="5" height="100" fill="#008000" />
  <rect x="40" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="45" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="50" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="55" y="0" width="5" height="100" fill="#008000" />
  <rect x="60" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="65" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="70" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="75" y="0" width="5" height="100" fill="#008000" />
  <rect x="80" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="85" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="90" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="95" y="0" width="5" height="100" fill="#A020F0" />
</svg>

A minta egy ismétlődő sorozat: `"yellow"`, `"blue"`, `"yellow"`, `"green"`. Az első és az utolsó csík `"purple"`.

A vászon, amin dolgozol, `100` széles és `100` magas. `20` csíkot kell rajzolnod, mindegyik `5` széles.

### A feladat szabályai

Ezt a feladatot nem oldhatod meg úgy, hogy egyszerűen 20 téglalap-utasítást írsz. A kódodnak tetszőleges méretű anyaggal is működnie kell. Sőt, a `rectangle(...)` (téglalap) függvényt csak egyszer használhatod a kódodban!

Ehelyett ciklust kell használnod, és a maradék (_remainder_ angolul) operátort (_operator_ angolul), amit az előző videóleckében láttunk. Gondold át alaposan az utasítások sorrendjét – ezen múlik, hogy sikerül-e a feladat.

Nyugodtan dolgozz, és érezd jól magad!
