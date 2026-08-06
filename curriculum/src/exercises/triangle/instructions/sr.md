---
title: "Trougao"
description: "Odredi tip trougla: jednakostranični, jednakokraki ili raznostranični."
en_md5: 15574e7bfbdfaffbd935bf6bba258e63
---

Tvoj zadatak je da napraviš funkciju koja proverava da li je trougao jednakostraničan, jednakokrak, raznostran ili neispravan.

### Trouglovi

- _Jednakostranični_ trougao ima sve tri stranice iste dužine.
- _Jednakokraki_ trougao ima dve stranice iste dužine.
- _Raznostranični_ trougao ima sve stranice različite dužine.

Da bi trougao bio ispravan:

- Sve stranice moraju biti veće od 0
- Ako sabereš bilo koje dve stranice, zbir mora biti veći od treće stranice.

### Funkcija

Funkcija mora da se zove `determineTriangleType` (odredi tip trougla). Mora da prima tri ulaza, koji će biti brojevi za tri stranice trougla. Mora da vrati jednu od vrednosti: `"invalid"`, `"equilateral"`, `"isosceles"` ili `"scalene"`.
