---
title: "Futáshossz-kódolás"
description: "Tömöríts és bonts ki szöveget az ismétlődő karakterek sorozatainak megszámlálásával."
en_md5: a176be7e6ed782e9aa4b54a4575f751f
---

A futáshossz-kódolás (_run-length encoding_ angolul) a tömörítés egy egyszerű formája. Az egymás után ismétlődő azonos karakterek sorozatát egy számmal és az adott egyetlen karakterrel helyettesítjük. Azokat a karaktereket, amelyek csak egyszer fordulnak elő, változatlanul hagyjuk, nem írunk eléjük számot.

Például az `"AABBBCCCC"` szöveg `"2A3B4C"`-re kódolódik, az `"XYZ"` (nincs ismétlődés) pedig egyszerűen `"XYZ"`-re.

A szóközök ugyanúgy karakternek számítanak, mint bármi más, így a `"  hsqq qww  "` `"2 hs2q q2w2 "`-re kódolódik.

### Két függvény

Írj két függvényt:

- `encode` (kódol) egy karakterláncot kap, és visszaadja a futáshossz-kódolt formáját.
- `decode` (dekódol) egy kódolt karakterláncot kap, és visszaadja az eredeti szöveget.

A dekódolás megfordítja a folyamatot: egy szám azt mondja meg, hányszor kell ismételni az utána következő karaktert. Ne feledd, hogy egy sorozat hosszabb is lehet, mint 9, így a szám több számjegyből is állhat (például a `"12W"` tizenkét `W`-t jelent).

### Amit tanultál, vidd gyakorlatba!

Bár sokféleképpen meg lehet oldani ezt a feladatot, azt szeretnénk, ha olyan megoldást készítenél, ami azt a `for` ciklust használja, amit az előző videóban tanultál. Ha nem emlékszel a szintaxisra, nézd meg a kapcsolódó fogalmakat a lap alján, mert elég csúnya!

Jó szórakozást!
