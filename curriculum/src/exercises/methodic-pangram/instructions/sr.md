---
title: "Metodični Pangram"
description: "Ažuriraj svoj Pangram tako da koristi ugrađene metode stringova."
en_md5: 61b73caa0318f68e9a0facca189e7abf
---

Treća Pangram vežba te je dočekala! U njoj ćemo uzeti sve one pomoćne funkcije koje smo napravili i dosta pojednostaviti stvari.

Svaka od funkcija za koje sam te ohrabrivao da napišeš (`includes`, `indexOf` i `toLowerCase`) zapravo je ugrađena u stringove kao metoda.

Tako da, umesto da pišeš `includes("Jeremy", "r")`, možeš da napišeš `"Jeremy".includes("r")` i to radi potpuno istu stvar. Ali pošto je ova metoda ugrađena u string, ne moraš sam da je pišeš!

Za ovu vežbu potrebne su ti samo dve:

- `"Jeremy".toLowerCase()`
- `"Jeremy".includes("r")`

`indexOf` ti više uopšte neće biti potreban – jedina svrha pisanja `indexOf`-a bila je da ti pomogne da izgradiš `toLowerCase`, a sada ugrađeni `toLowerCase` radi taj posao umesto tebe.

Tako da možeš da obrišeš sve one funkcije (ali bar sada znaš kako ove metode zapravo rade ispod haube, pa nemoj mi preterano zameriti!) i da umesto njih koristiš ove.

Uživaj!
