---
title: "Luhn"
description: "Azonosító számok (például hitelkártyaszámok) ellenőrzése a Luhn-ellenőrzőösszeggel."
en_md5: 07b0aea3adc2353e50a26e5cbe5cd162
---

Az előbb az ISBN-számok érvényesítését néztük meg. Van egy másik elterjedt képlet, amit sokféle helyzetben használnak számok ellenőrzésére: a **Luhn-formula** (_Luhn formula_ angolul). Legismertebb felhasználása a hitelkártyaszámok elgépeléseinek kiszűrése.

### A Luhn-ellenőrzés

A Luhn-ellenőrzés lépései a következők:

- A **jobb szélső** számjegytől indulva balra haladva **duplázzuk meg minden második számjegy értékét**.
- Ha egy számjegy duplázása 9-nél nagyobb számot eredményez, vonjunk ki belőle 9-et.
- Ezután adjuk össze az összes számjegyet.
- Ha az összeg maradék nélkül osztható 10-zel, a szám érvényes.

Például a `"067"` esetén a következő lépéseket járjuk végig:

```
0   6   7     // eredeti számjegyek
0  12   7     // minden második számjegyet duplázzuk (jobbról)
0   3   7     // a 12 nagyobb, mint 9, így kivonunk belőle 9-et → 3
       10     // a számjegyek összeadása
     true     // a 10 osztható 10-zel, tehát 067 érvényes
```

### A te feladatod

Hozz létre egy `valid` (érvényes) nevű függvényt, amely egy stringet kap, és `true`-t ad vissza, ha átmegy a Luhn-ellenőrzésen, és `false`-t, ha nem.

A számok stringként érkeznek, és az olvashatóság érdekében tartalmazhatnak szóközöket (például `"4539 1488 0343 6467"`). A szóközöket figyelmen kívül kell hagyni.

Néhány fontos megjegyzés:

- A bemenet tartalmazhat szóközöket – ezeket hagyd figyelmen kívül.
- Ha a bemenet bármilyen más karaktert tartalmaz, `false`-t kell visszaadnod.
- Az 1 vagy annál rövidebb hosszúságú stringek (a szóközök eltávolítása után) **nem** érvényesek.

### Alkalmazd a tanultakat

Bár ezt a feladatot sokféleképpen meg lehet oldani, az általunk várt megoldás egy `for` ciklust használ.

Szükséged lesz az előző feladatban bemutatott <a href="/concepts/type-conversion" target="_blank" rel="noopener noreferrer">`Number(str)`</a> függvényre is.

Jó szórakozást!
