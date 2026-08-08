---
title: "Betűtartó"
description: "Találd meg pontosan, hol van egy betű a betűtartón."
en_md5: 156e18323706fc278f7a887f421c01f3
---

Egy automata Scrabble-botot építesz. A botnak van egy betűtartója, amit egy string reprezentál (pl. `"AERHBT"`). Amikor a bot eldönti, melyik betűt játssza ki, tudnia kell, melyik pozícióba mozdítsa a kezét, hogy felvegye a betűt.

Írj egy `findTile` (keresd meg a betűt) nevű függvényt, amely paraméterként megkapja a betűtartót (egy betűkből álló stringet) és a keresendő betűt. Ha megtalálod a betűt, add vissza a `"Move to position X"` stringet, ahol X az első egyező betű pozíciója (1-től számolva). Ha a betű nincs a tartóban, add vissza az `"Error: Tile not on rack"` stringet.

Ahhoz, hogy összeállítsd az eredménystringet, át kell alakítanod a pozíció számát stringgé, és össze kell fűznöd a részeket összefűzéssel (`+`) vagy template stringgel.

### Példák

- `findTile("ABCDE", "A")` visszaadja `"Move to position 1"`
- `findTile("ABCDE", "C")` visszaadja `"Move to position 3"`
- `findTile("BANANA", "A")` visszaadja `"Move to position 2"` (az első A-t)
- `findTile("ABCDE", "Z")` visszaadja `"Error: Tile not on rack"`
