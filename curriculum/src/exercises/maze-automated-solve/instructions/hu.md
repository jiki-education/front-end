---
title: "Oldd meg a labirintust programozással"
description: "Írj kódot, ami önállóan bejárja bármelyik labirintust."
en_md5: d3f3c0d2727632fe7872d07e1c2cd99a
---

Az első labirintusos feladatban kézzel mozgattad a figurádat a labirintusban. Most már készen állsz, hogy kóddal oldj meg bármilyen labirintust!

Ehhez három új függvényt kapsz:

- `canTurnLeft()` (balra tud fordulni): `true`-t ad vissza, ha a figurától balra nincs fal.
- `canTurnRight()` (jobbra tud fordulni): `true`-t ad vissza, ha a figurától jobbra nincs fal.
- `canMove()` (tud előre menni): `true`-t ad vissza, ha a figura előtt nincs fal.

Ha ezeket összekapcsoljuk a korábban megismert `move()` (mozogj), `turnLeft()` (fordulj balra) és `turnRight()` (fordulj jobbra) függvényekkel, akkor felírhatunk egy olyan algoritmust, ami **bármilyen** labirintust megold. Az „algoritmus” egy kicsit csicsás szó, ami egyszerűen annyit tesz: „valaminek az elvégzési módja”. Olyan, mint egy képlet vagy egy recept.

Lejjebb az utasításokban megmutatom az algoritmust, amit le kell kódolnod. De szeretném, ha először magad próbálnád kitalálni, mint egy kis logikai feladatot. Ha tudod, hogy balra, jobbra tudsz-e fordulni, vagy előre tudsz-e menni, hogyan oldhatsz meg bármilyen labirintust, amit adok neked?

Ha rájöttél, vagy feladtad, görgess lejjebb, hogy megnézd a megoldást, és azt, hogy milyen kódot kell írnod.

<hr style="border-top: 1px solid var(--color-gray-200); margin:40px 0"/>

### Az algoritmus

Oké – ez nehéz feladat volt, úgyhogy gondolom lehettek ötleteid, de nem állt össze a teljes kép. Itt vannak a lépések, amiket követned kell:

- Ha balra tudsz fordulni, fordulj balra, és menj előre.
- Ha nem, de előre tudsz menni, menj előre.
- Ha nem, de jobbra tudsz fordulni, fordulj jobbra, és menj előre.
- Ha egyik sem, fordulj meg.

Ha ezt megteszed, bármilyen labirintust megoldasz!

Írd le ezeket az utasításokat kódban. Jó szórakozást!
