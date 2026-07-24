---
title: "Break"
description: "A `break` kulcsszó használata a ciklus törzsében: azonnal kilépünk a ciklusból, és a ciklus utáni kóddal folytatjuk."
en_md5: f8227210406f1fd67f41fdb58e6c196d
---

A `break` kulcsszót bármelyik ciklus törzsében bárhol használhatod.

A kapcsos zárójelek (`{}`) közötti rész a ciklus törzse. Amikor Jiki meglát egy `break`-et, azonnal kilép a ciklusból, és azzal a kóddal folytatja, ami a ciklus alatt következik.

Tegyük fel, hogy van egy megkötésünk: a ciklusnak 50-szer kell lefutnia, de meg akarunk állni, ha a játékos már ötször lőtt. Ilyenkor a tetejére írhatunk egy `for` ciklust, ami `i = 0`-tól addig megy, amíg az `i` kisebb, mint 50.

A ciklus közepére viszont betehetünk egy feltételt, ami azt mondja: ha `numShots >= 5`, akkor jöjjön a `break` (szakítsd meg), vagyis a ciklus álljon le.

```javascript
for (let i = 0; i < 50; i++) {
  if (numShots >= 5) {
    break; // kilépés a ciklusból
  }
}
```
