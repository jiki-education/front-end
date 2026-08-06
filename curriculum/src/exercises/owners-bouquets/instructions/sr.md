---
title: "Vlasnikovi buketi"
description: "Posadi cveće u različitim rasporedima bašte."
en_md5: bdb2a772a6549db0226a6c17326f20c6
---

Dobrodošao na tvoju drugu vežbu sa scenarijima.

Vraćamo se sa našom automatizovanom baštenskom mašinom. Ranije smo uvek sadili 9 cvetova, ali sada se stvari menjaju. Treba nam da naš robot bude u stanju da posadi onoliko cveća koliko mu vlasnik kuće kaže.

Da bismo ovo uradili, imamo funkciju pod nazivom `askNumberOfFlowers()` (što znači „zatraži broj cveća”). Kada je koristimo, pitamo vlasnika kuće koliko cveća da posadimo, a funkcija vraća broj sa odgovorom. Ako funkcija vrati 3, moramo da posadimo 3 cveta. Ako vrati 8, moramo da posadimo 8 cvetova.

Imamo stroga uputstva da baštu održavamo urednom, pa moramo da posadimo cveće ravnomerno po celoj bašti. Ako ima 3 cveta, treba da ih posadimo na 25, 50 i 75. Ako ima 4 cveta, treba da ih posadimo na 20, 40, 60, 80, itd. (Kao i obično, bašta je široka 100 jedinica).

### Scenariji

Kao u vežbi sa golfom, koja je bila tvoja prethodna vežba, sa leve strane ćeš videti četiri sive tačke za četiri različita scenarija. **Klikom na svaku tačku** dobijaš različiti scenario, ali ovoga puta je `askNumberOfFlowers()` ta koja će svaki put vratiti različit broj.

Tvoj zadatak je da napišeš jedan program koji radi za sve različite moguće vrednosti koje `askNumberOfFlowers()` može da vrati.

Srećno!
