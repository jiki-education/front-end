---
title: "Háromszög"
description: "Határozd meg, hogy a háromszög egyenlő oldalú, egyenlő szárú vagy általános."
en_md5: 15574e7bfbdfaffbd935bf6bba258e63
---

A feladatod egy olyan függvény létrehozása, amely ellenőrzi, hogy egy háromszög egyenlő oldalú, egyenlő szárú, általános vagy érvénytelen-e.

### Háromszögek

- Az _egyenlő oldalú_ háromszög mindhárom oldala egyenlő hosszúságú.
- Az _egyenlő szárú_ háromszögnek két oldala egyenlő hosszúságú.
- Az _általános_ háromszög mindhárom oldala különböző hosszúságú.

A háromszög akkor érvényes, ha:

- Minden oldal nagyobb, mint 0
- Bármely két oldal összege nagyobb, mint a harmadik oldal.

### A függvény

A függvény neve `determineTriangleType` (háromszög típusának meghatározása). Három bemenetet vár, ezek a háromszög három oldalának hosszát megadó számok. A visszatérési értéke a következők egyike: `"invalid"`, `"equilateral"`, `"isosceles"` vagy `"scalene"`.
