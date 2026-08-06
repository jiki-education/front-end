---
title: "Pretraga pločice"
description: "Pretraži stalaz pločica da pronađeš određeno slovo."
en_md5: bbbc77ef2c270fd4228d6a20e690a095
---

Praviš Scrabble bota. Pre nego što bot pokuša da odigra reč, treba da proveri da li ima pločicu sa određenim slovom u svom stalazu.

Stalak je predstavljen kao string slova (npr. `"SCRAB"`).

Napiši funkciju pod imenom `contains` (sadrži) koja prima dva ulaza:

- `haystack` (plast sena): stalaz pločica, kao string
- `needle` (igla): slovo koje se traži

Vrati `true` ako je slovo na stalazu, ili `false` ako nije.

Primeri:

- `contains("SCRAB", "A")` vraća `true`
- `contains("SCRAB", "Z")` vraća `false`
- `contains("", "A")` vraća `false`
