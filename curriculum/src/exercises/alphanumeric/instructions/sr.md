---
title: "Alfanumerički"
description: "Napravi funkcije koje klasifikuju tekst na slova, brojeve ili oboje."
en_md5: 4a99adb1b883c6f6710a3494a8961cc2
---

U ovoj vežbi, tvoj zadatak je da napraviš funkcije koje proveravaju da li string sadrži slova i/ili brojeve.

Trebaće da napišeš tri pomoćne funkcije:

- `isAlpha(string)` (određuje da li string sadrži samo slova), proverava da li se string sastoji isključivo od ASCII slova (npr. `"A"`, `"a"`, `"Hello"`)
- `isNumeric(string)` (određuje da li string sadrži samo brojeve), proverava da li se string sastoji isključivo od numeričkih karaktera (npr. `"0"`, `"1"`, `"456"`)
- `isAlphanumeric(string)` (određuje da li string sadrži samo slova ili brojeve), proverava da li se string sastoji isključivo od ASCII slova ili brojeva (npr. `"Hello"`, `"42"`, `"Hello42"`)

Za bilo koje druge simbole (npr. `"! ?"`) ili ne-ASCII karaktere (npr. `"じき"`, `"正直"`), sve tri funkcije treba da vrate `false`.

Zatim napiši funkciju `whatAmI(string)` (klasifikuje string) koja koristi te pomoćne funkcije da klasifikuje string:

- Stringovi koji sadrže samo slova treba da vrate `"Alpha"`
- Stringovi koji sadrže samo brojeve treba da vrate `"Numeric"`
- Stringovi koji sadrže i slova i brojeve treba da vrate `"Alphanumeric"`
- Sve ostalo treba da vrati `"Unknown"`

### Iskoristi upravo stečeno znanje

Iako postoji mnogo ispravnih načina da se reši ova vežba, rešenje koje želimo da smisliš koristi naredbu `continue` i tri gore navedene funkcije.

Ova vežba te takođe izaziva da celu stvar rešiš u 42 reda koda ili manje. Taj cilj nije nužno i najprodukcionije rešenje. Sa par redova više verovatno se dobija lepše, a postoje i kraća rešenja. Ali to je dobar cilj ka kome da usmeriš svoje sposobnosti.

Uživaj!
