---
title: "Szószámlálás"
description: "Számold meg, hányszor fordul elő egy-egy szó egy mondatban."
en_md5: f9b46f800337d7fff2aab88b6e368e3d
---

Angolt tanítasz idegen nyelvként középiskolás diákoknak. Úgy döntöttél, hogy az egész tananyagodat tévéműsorokra alapozod. Elemezned kell, hogy mely szavak fordulnak elő, és milyen gyakran ismétlődnek.

A feladatod, hogy megszámold, hányszor fordul elő egy-egy szó egy dráma feliratában. A feliratok csak ASCII karaktereket használnak.

A szereplők gyakran kötetlen angolt beszélnek, és olyan összevonásokat használnak, mint a _they're_ vagy az _it's_. Bár ezek az összevonások két szóból származnak, az összevonás egyetlen szónak számít.

A szavakat bármilyen írásjel (például „:”, „!” vagy „?”) vagy szóköz választhatja el egymástól. Az egyetlen írásjel, amely nem választja el a szavakat, az összevonásokban szereplő aposztróf.

A számok is szónak számítanak. Ha a felirat azt mondja, hogy „It costs 100 dollars”, akkor a „100” külön szó lesz.

A szavak kis- és nagybetűérzéketlenek. Például a „you” szó háromszor fordul elő ebben: „You come back, you hear me? DO YOU HEAR ME?”

Hozz létre egy `countWords` (számold meg a szavakat) nevű függvényt, amely bemenetként egy mondatot kap, és egy szótárat ad vissza, ahol a kulcsok a szavak, az értékek pedig a gyakoriságuk.
