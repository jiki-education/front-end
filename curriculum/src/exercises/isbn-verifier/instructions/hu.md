---
title: "ISBN-ellenőrző"
description: "Ellenőrizd, hogy egy könyv ISBN-száma érvényes-e."
en_md5: 1f50053213b8649f126851f264174e53
---

Minden könyv rendelkezik egy ISBN-nel, egy 10 számjegyből álló azonosítóval, amely egyértelműen azonosítja. Minden ISBN egyedi, és meghatározott formátumot követ. Létezik egy formális ellenőrzési folyamat is, amellyel ellenőrizhető, hogy egy string ISBN-e – ezt fogod elkészíteni ebben a feladatban.

Az ISBN-ek általában kötőjeleket tartalmaznak, és így néznek ki: `3-598-21508-8`

(Léteznek 13 jegyű ISBN-ek is, de ezekkel most nem kell foglalkoznod!)

### Az ISBN ellenőrzése

Az ISBN ellenőrzéséhez a következőket tesszük:

- Balról indulva összeadjuk a számjegyeket, mindegyiket megszorozva egy 10‑től 1‑ig csökkenő súllyal.
- Vesszük ennek az összegnek a 11-gyel való osztási maradékát.
- Ellenőrizzük, hogy ez a maradék nulla-e.

Például a `3-598-21508-8` ISBN esetében azt ellenőrizzük, hogy:

```
(3*10 + 5*9 + 9*8 + 8*7 + 2*6 + 1*5 + 5*4 + 0*3 + 8*2 + 8*1) % 11 === 0
```

Mivel az eredmény 0, ez bizonyítja, hogy az ISBN-ünk érvényes.

Néhány további fontos megjegyzés:

- Az ISBN néha X-re végződhet. Ilyenkor az X a `10`-et jelenti. Ha az X bárhol máshol jelenik meg, az ISBN érvénytelen.
- Az ISBN-ek kötőjelekkel vagy anélkül is írhatók.
- Bármilyen más karakter érvénytelenné teszi az ISBN-t.

### A feladatod

Készíts egy `isValidIsbn(isbn)` (érvényes ISBN) nevű függvényt, amely egy ISBN stringet kap, és `true` értéket ad vissza, ha érvényes, és `false` értéket, ha nem.

### A Number(...) függvény

Egy dolog, amit még nem vettünk át, de amit tudnod kell, az a `Number(str)` függvény. Ez egy olyan függvény, amely egy stringet kap, és azt a stringet számmá alakítva adja vissza. Így ha beírod, hogy `Number("1234")`, akkor `1234`-et kapsz. Ez egy furcsa függvény, mert nagybetűvel kezdődik. Most ne foglalkozz ezzel – később elmagyarázzuk, hogy miért van ez így.

Erről bővebben a <a href="/concepts/type-conversion" target="_blank" rel="noopener noreferrer">Típuskonverzió fogalomoldalon</a> olvashatsz.

### Használd, amit tanultál

Ahogyan az előző feladatban is, bár sok érvényes megoldás létezik erre a feladatra, azt szeretnénk, ha a megoldásod egy `continue` utasítást használna.

A bónusz forgatókönyv azt a kihívást állítja eléd, hogy oldd meg ezt a feladatot 22 kódsorban. Léteznek rövidebb megoldások is, de ha 22 sorban megvagy, akkor már jól optimalizáltad a kódot.

Jó szórakozást hozzá!
