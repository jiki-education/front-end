---
title: "Esőcsepp-hangok"
description: "Alakítsd a számokat esőcsepp-hangokká: Pling, Plang és Plong."
en_md5: 93b85e63b3d48e4e7f6d249592b367a1
---

A Raindrops a klasszikus FizzBuzz-feladat egy változata, amit programozási interjúkon már régóta használnak.

A feladatod, hogy egy számot a neki megfelelő esőcsepp-hangokká alakíts.

Ezt úgy csináljuk, hogy megnézzük, a szám mivel osztható (például a 10 osztható 1-gyel, 2-vel, 5-tel és 10-zel, a 12 pedig osztható 1-gyel, 2-vel, 3-mal, 4-gyel, 6-tal és 12-vel).

Ha egy adott szám:

- osztható 3-mal, add hozzá az eredményhez a "Pling" stringet.
- osztható 5-tel, add hozzá az eredményhez a "Plang" stringet.
- osztható 7-tel, add hozzá az eredményhez a "Plong" stringet.
- nem osztható 3-mal, 5-tel vagy 7-tel, akkor az eredmény a szám stringként jelenjen meg.

Létre kell hoznod egy `raindrops(num)` (esőcseppek(szám)) nevű függvényt, amely bemenetként egy számot kap, és visszaadja az esőcsepp-hangjait.

Az eredmény stringet összefűzés (_concatenation_ angolul) (`+`) vagy egy string-sablon (_template string_ angolul) segítségével állítsd össze.

### Példák

- A `raindrops(28)` a "Plong" értéket adja vissza, mert a 28 osztható 7-tel, de 3-mal és 5-tel nem.
- A `raindrops(30)` a "PlingPlang" értéket adja vissza, mert a 30 osztható 3-mal és 5-tel, de 7-tel nem.
- A `raindrops(34)` a "34" értéket adja vissza, mert a 34 nem osztható 3-mal, 5-tel vagy 7-tel.
