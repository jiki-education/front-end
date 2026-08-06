---
title: "Space Invaders: Uslovno"
description: "Pucaj samo kad ti je vanzemaljac na nišanu."
en_md5: 4a603e339af722e912ab2ff9b25cc287
---

Vanzemaljci su promenili formaciju! Sada su raspoređeni u dva reda, ali nema vanzemaljca u svakoj koloni.

Imaš tri funkcije:

- `move()` (pomeri se) pomera tvoj laserski top za jedno mesto udesno
- `shoot()` (pucaj) ispaljuje laser naviše
- `isAlienAbove()` (vanzemaljac je iznad) vraća `true` ako je vanzemaljac iznad tebe, ili `false` ako nije

Treba da se krećeš po ekranu, proveravajući svaku poziciju. Ako je vanzemaljac iznad tebe, pucaj na njega! Ako nije, samo nastavi dalje.

**Ne pucaj kad iznad tebe nema vanzemaljca, inače gubiš!**
