---
title: "Polica sa pločicama"
description: "Pronađi tačno gde se nalazi pločica na polici sa pločicama."
en_md5: 156e18323706fc278f7a887f421c01f3
---

Praviš automatizovanog bota za Scrabble. Bot ima policu sa pločicama sa slovima koja je predstavljena kao string (npr. `"AERHBT"`). Kada bot odluči koje slovo da odigra, treba da zna na koju poziciju (engl. _position_) da pomeri svoju ruku kako bi podigao pločicu.

Napiši funkciju pod nazivom `findTile` (pronađi pločicu) koja prima policu (string slova) i slovo koje treba pronaći. Ako je pločica pronađena, vrati `"Move to position X"` gde je X pozicija prve odgovarajuće pločice (počevši od 1). Ako pločica nije na polici, vrati `"Error: Tile not on rack"`.

Da bi napravio rezultujući string, treba da pretvoriš broj pozicije u string i spojiš delove koristeći spajanje stringova (`+`) ili template string.

Primeri:

- `findTile("ABCDE", "A")` vraća `"Move to position 1"`
- `findTile("ABCDE", "C")` vraća `"Move to position 3"`
- `findTile("BANANA", "A")` vraća `"Move to position 2"` (prvi A)
- `findTile("ABCDE", "Z")` vraća `"Error: Tile not on rack"`
