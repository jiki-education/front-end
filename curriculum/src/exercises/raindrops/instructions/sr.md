---
title: "Zvuci kišnih kapi"
description: "Pretvori brojeve u zvuke kišnih kapi: Pling, Plang i Plong."
en_md5: 93b85e63b3d48e4e7f6d249592b367a1
---

Kišne kapi je verzija klasičnog FizzBuzz izazova koji se već godinama koristi na programerskim intervjuima.

Tvoj zadatak je da pretvoriš broj u odgovarajuće zvuke kišnih kapi.

To radimo tako što utvrdimo čime je broj deljiv (npr. broj 10 je deljiv sa 1, 2, 5 i 10. Broj 12 je deljiv sa 1, 2, 3, 4, 6 i 12).

Ako je dati broj:

- deljiv sa 3, dodaj `'Pling'` u rezultat.
- deljiv sa 5, dodaj `'Plang'` u rezultat.
- deljiv sa 7, dodaj `'Plong'` u rezultat.
- nije deljiv ni sa 3, ni sa 5, ni sa 7, rezultat treba da bude broj kao string.

Potrebno je da napišeš funkciju `raindrops(num)` (kišne kapi) koja prima broj kao ulaz i vraća odgovarajuće zvuke kišnih kapi.

Napravi rezultujući string koristeći spajanje (engl. _concatenation_) (`+`) ili template string.

### Primeri

- `raindrops(28)` vraća `'Plong'` zato što je 28 deljivo sa 7, ali ne i sa 3 ili 5.
- `raindrops(30)` vraća `'PlingPlang'` zato što je 30 deljivo i sa 3 i sa 5, ali ne i sa 7.
- `raindrops(34)` vraća `'34'` zato što 34 nije deljivo ni sa 3, ni sa 5, ni sa 7.
