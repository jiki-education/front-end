---
title: "Alfanumerikus"
description: "Készíts függvényeket, amelyek eldöntik, hogy egy szöveg csak betűkből, csak számokból, vagy mindkettőből áll."
en_md5: 4a99adb1b883c6f6710a3494a8961cc2
---

Ebben a feladatban az a feladatod, hogy olyan függvényeket készíts, amelyek ellenőrzik, hogy egy string betűket, számokat vagy mindkettőt tartalmaz-e.

Három segédfüggvényt kell írnod:

- `isAlpha(string)` (csak betűkből áll) — meghatározza, hogy egy string csak ASCII betűket tartalmaz-e (pl. "A", "a", "Hello")
- `isNumeric(string)` (csak számokból áll) — meghatározza, hogy egy string csak numerikus karaktereket tartalmaz-e (pl. "0", "1", "456")
- `isAlphanumeric(string)` (csak betűkből vagy számokból áll) — meghatározza, hogy egy string csak ASCII betűket vagy számokat tartalmaz-e (pl. "Hello", "42", "Hello42")

Minden más szimbólum (pl. "! ?") vagy nem ASCII karakter esetén mindhárom függvény hamisat adjon vissza.

Ezután írj egy `whatAmI(string)` (mi vagyok) függvényt, amely ezeket a segédfüggvényeket használja a string osztályozásához:

- A csak betűket tartalmazó stringekre a függvény `"Alpha"`-t adjon vissza.
- A csak számokat tartalmazó stringekre a függvény `"Numeric"`-t adjon vissza.
- A betűket és számokat is tartalmazó stringekre a függvény `"Alphanumeric"`-t adjon vissza.
- Minden más esetben `"Unknown"`-t adjon vissza.

### Használd a tanultakat

Bár ezt a feladatot sokféle érvényes módon meg lehet oldani, az a megoldás, amit szeretnénk, ha kidolgoznál, a `continue` utasítást és a fenti három függvényt használja.

Ez a feladat arra is kihívást jelent, hogy az egészet legfeljebb 42 sornyi kódban oldd meg. Ez a cél nem feltétlenül a legjobban használható megoldás. Pár plusz sorral valószínűleg szebb megoldást kaphatnál, és léteznek rövidebb megoldások is. De jó célkitűzés, hogy feszegethesd a képességeid határait.

Jó szórakozást!
