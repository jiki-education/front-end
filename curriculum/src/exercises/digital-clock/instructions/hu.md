---
title: "Digitális óra"
description: "Jelenítsd meg a pontos időt egy 12 órás digitális órán."
en_md5: e3decc089d371b7113f2657f7571c001
---

Ebben a feladatban két új függvényt fogsz használni az idő lekérdezéséhez:

- `currentTimeHour()` (aktuális óra): az aktuális órát adja vissza számként, 24 órás formátumban (pl. 15 perccel éjfél előtt `23`-at ad vissza).
- `currentTimeMinute()` (aktuális perc): az aktuális percet adja vissza számként.

A te dolgod, hogy a digitális órát azon számok alapján frissítsd, amiket ez a két függvény visszaad.

A digitális óra a számokat 12 órás formátumban várja, `am` vagy `pm` jelöléssel (ezt hívják „meridiemnek”).

Például:

- `7:45` -> `7:45am`
- `19:45` -> `7:45pm`

Az idő megjelenítéséhez a `displayTime(hour, minutes, meridiem)` (idő megjelenítése) függvényt használod.

Az aktuális idő minden forgatókönyvben más. Neked olyan kódot kell írnod, amivel az összes forgatókönyv működik. Az utolsó forgatókönyvben a valódi időt használjuk, így az a forgatókönyv minden percben változik, ahogy a valódi idő halad előre!
