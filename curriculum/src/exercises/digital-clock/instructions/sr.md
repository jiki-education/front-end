---
title: "Digitalni sat"
description: "Prikaži tačno vreme na 12-časovnom digitalnom satu."
en_md5: e3decc089d371b7113f2657f7571c001
---

U ovoj vežbi koristićeš dve nove funkcije da dobiješ vreme:

- `currentTimeHour()` (trenutni sat): vraća trenutni sat u 24-časovnom formatu (npr. 15 minuta do ponoći vratilo bi `23`), kao broj.
- `currentTimeMinute()` (trenutni minut): vraća trenutni minut kao broj.

Tvoj zadatak je da ažuriraš digitalni sat na osnovu brojeva koje te funkcije vrate, kakvi god oni bili.

Digitalni sat očekuje brojeve u 12-časovnom formatu, sa oznakom `am` ili `pm` (ono što se naziva „meridiem“).

Na primer:

- `7:45` -> `7:45am`
- `19:45` -> `7:45pm`

Da prikažeš vreme na satu, koristiš funkciju `displayTime(hour, minutes, meridiem)` (prikaži vreme).

U svakom scenariju funkcije vraćaju drugo vreme. Tvoj zadatak je da napišeš kod koji radi u svim scenarijima. U poslednjem scenariju koristimo stvarno trenutno vreme, pa će se scenario menjati svaki put kada se stvarno vreme promeni za jedan minut!
