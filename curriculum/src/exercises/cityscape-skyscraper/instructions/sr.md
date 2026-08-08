---
title: "Neboder"
description: "Izgradi neboder na gradskoj mreži."
en_md5: 901851ded0ac8a0ef6cb80db60e59998
---

Ovo je prva od dve vežbe u kojima ćeš graditi nebodere.

U ovoj vežbi tvoj zadatak je da sagradiš jedan neboder na sredini scene. U svakom scenariju visina nebodera varira.

Da bi odredio koliko spratova da sagradiš, imaš funkciju `numFloors()` (broj spratova) koja vraća ukupnu visinu zgrade.

Postoje tri različite komponente koje možeš da koristiš: zid (`W`), staklo (`G`) i ulaz (`E`). Pogledaj funkcije ispod da vidiš funkcije za pravljenje ovih komponenti.

Sprat najbliži tlu (bilo „prizemlje” ili „prvi sprat”, u zavisnosti od toga gde si!) uvek ima ulaz između dva staklena segmenta i dva spoljna zidna segmenta (`WGEGW`). Ostali spratovi imaju tri staklena segmenta između zidova (`WGGGW`). A na vrhu spratova je krov (`WWWWW`).

Dakle, neboder od 5 spratova ima jedan sprat sa ulazom, 4 staklena sprata i krov. Trebalo bi da izgleda ovako:

```
WWWWW
WGGGW
WGGGW
WGGGW
WGGGW
WGEGW
```

Centar nebodera treba da bude u koloni `19`. Prizemni sprat počinje od `2` (odmah iznad betonskog poda) i ide nagore (tako da bi u gornjem primeru to bio sprat sa ulazom na `2` i krov na `7`).

Jedno važno pravilo u ovoj vežbi je da sve vrednosti koje unosiš u funkcije moraju biti ili promenljive ili formule. Ne možeš samo da uneseš broj poput `20`.

Kad završiš ovu vežbu, otključaćeš Projekat u kome ćeš graditi cele gradske horizonte sa različitim brojem zgrada različitih širina.
