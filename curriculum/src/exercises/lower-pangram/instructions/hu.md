---
title: "Egyszerű pangramma"
description: "Ellenőrizd, hogy egy mondat az ábécé minden betűjét használja-e."
en_md5: 50b09bb1fbd35081cb842c55fc40e313
---

A pangramma (_pangram_ angolul) olyan mondat, amely **az ábécé minden betűjét legalább egyszer** használja. A legismertebb angol pangramma: "the quick brown fox jumps over the lazy dog"!

A következő három feladat mind arról fog szólni, hogy eldöntsük, egy-egy mondat pangramma-e.

Ebben az első feladatban csak a kisbetűkkel kell foglalkoznod. A bemenet csak kisbetűket és egyéb karaktereket, például szóközöket, számokat vagy írásjeleket tartalmaz, nagybetűket viszont nem.

A feladatod, hogy megírd az `isPangram(sentence)` (egy mondatról eldönti, hogy pangramma-e) függvényt, amely egy mondatot kap bemenetként, és `true`-t ad vissza, ha a mondat az "a"-tól "z"-ig minden betűt legalább egyszer tartalmaz, egyébként pedig `false`-t.

### Segédfüggvények

A feladat teljesítéséhez ebben a feladatban nem használhatsz egymásba ágyazott ciklusokat. Ehelyett, akárcsak az előző feladatban, a kulcs az, hogy készíts egy **segédfüggvényt**, amelyet az `isPangram(...)` használ.

Ez a segédfüggvény segít eldönteni, hogy egy string tartalmaz-e egy másik stringet. Javasoljuk, hogy a függvényt nevezd el `includes`-nek, a bemenő paramétereit pedig `haystack` (szénakazal) és `needle` (tű) néven vedd fel. Az a gondolat áll mögötte, hogy "megtaláljuk a tűt a szénakazalban" – ez egy régi angol közmondás.

Ha a több függvény létrehozása nyomasztónak érződik, először megoldhatod a feladatot a segédfüggvény nélkül, egy egymásba ágyazott ciklussal, és utána gondold át, hogyan bonthatnád ki belőle a segédfüggvényt.

Jó szórakozást!
