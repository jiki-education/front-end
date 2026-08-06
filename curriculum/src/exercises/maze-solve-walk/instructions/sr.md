---
title: "Prošetaj se"
description: "Prođi kroz lavirint koristeći funkciju koja prelazi više koraka odjednom."
en_md5: 91ee3e60f948f052d7551029f5d6fdf7
---

Ponovo smo u lavirintu! Kad si poslednji put ovde, koristiš funkciju `move()` (pomeri se) — pomeraš se jedan po jedan korak. To radi, ali prilično je dosadno pisati `move()` mnogo puta uzastopno!

U ovoj vežbi, zamenili smo `move()` novom funkcijom (engl. _function_) po imenu `walk()` (koračaj). Ova funkcija kao ulaz (engl. _input_) uzima broj i pomera te napred za taj broj koraka. Na primer, `walk(3)` pomera te napred za 3 koraka, a `walk(1)` pomera te napred za samo 1 korak.

U svim budućim vežbama, imaćeš odeljak „Funkcije“ poput onog ispod koji olakšava da tačno vidiš koje funkcije su ti na raspolaganju i kako rade.

Iskoristi `walk()`, `turnLeft()` (okreni levo), i `turnRight()` (okreni desno) da prođeš kroz lavirint i stigneš do zelenog ciljnog polja.
