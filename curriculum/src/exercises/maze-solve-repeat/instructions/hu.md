---
title: "Ciklusos labirintus"
description: "Refaktorálj egy labirintusmegoldást úgy, hogy ismétlődő kód helyett ciklusokat használsz."
en_md5: 6ee8a02aea4617a21e320428e66eab5e
---

Kaptál egy működő labirintusmegoldást, de nagyon hosszú és ismétlődő. A feladatod, hogy a kódot a lehető **legkevesebb sorossá** tedd.

A titok abban rejlik, hogy `repeat` ciklusokat (_loops_ angolul) használsz, hogy a kód rövidebb legyen. Például. Ne feledd, a `repeat` ciklus szintaxisa a következő:

```javascript
repeat(3) {
  // Ide kerülnek az ismétlendő utasítások.
}
```

A célod itt az, hogy a kód a lehető legrövidebb legyen – **22 sorból álljon**. Ez azt jelenti, hogy végig kell gondolnod, mikor érdemes `repeat` ciklust használni, és mikor nem. Vedd figyelembe, hogy az üres sorok és a csak megjegyzéseket tartalmazó sorok nem számítanak bele a célba, úgyhogy nyugodtan tagolhatod a kódot szóközökkel, hogy olvashatóbb legyen!

Sok szerencsét!
