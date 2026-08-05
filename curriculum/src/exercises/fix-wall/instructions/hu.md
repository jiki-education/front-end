---
title: "Javítsd meg a falat"
description: "Töltsd ki a repedéseket a törött falon téglalapokkal."
en_md5: ba2f5a5d726cef8cb80841c6e16132c6
---

Üdvözlünk az első rajzos feladatodban. Ebben a feladatban téglalapokat fogsz rajzolni a `rectangle` (téglalap) függvény (_function_ angolul) segítségével.

Ahhoz, hogy téglalapot rajzoljunk, ismernünk kell a felső és bal pozíciót, valamint a téglalap szélességét és magasságát. Amikor a `rectangle` függvényt használjuk, ezeket **bemenetként** (_inputs_ angolul) adhatjuk meg:

- `left` (bal széle): A téglalap bal széle
- `top` (felső széle): A téglalap felső széle
- `width` (szélesség): A téglalap szélessége
- `height` (magasság): A téglalap magassága

<img src="/static/images/exercise-assets/fix-wall/intro-rectangle.webp" alt="Javítsd meg a falat" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

A rajzfelület mindig 100 széles és 100 magas. Tehát a vászon bal felső sarka `0,0`, a jobb alsó sarka pedig `100,100`. **Ha fölé viszed az egeret a vászon fölött**, ellenőrizheted, hogy hova kell kerülnie valaminek.

### A fal kijavítása

A feladatod, hogy három téglalappal kitöltsd a lyukakat a falon.

Hogy megkönnyítsük a dolgodat, a felső, a bal, a magasság és a szélesség mind osztható 10-zel.
