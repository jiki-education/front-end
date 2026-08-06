---
title: "Csempekeresés"
description: "Keresgélj végig egy csempekészleten, hogy megtalálj egy adott betűt."
en_md5: bbbc77ef2c270fd4228d6a20e690a095
---

Egy Scrabble-botot építesz. Mielőtt a bot megpróbál kirakni egy szót, ellenőriznie kell, hogy van-e egy adott betűcsempe a készletében.

A készlet egy betűkből álló stringként van ábrázolva (pl. `"SCRAB"`).

Írj egy `contains` (tartalmaz) nevű függvényt, amely két bemenetet kap:

- `haystack` (szénakazal): a csempekészlet, stringként
- `needle` (tű): a keresendő betű

Add vissza `true`-t, ha a betű benne van a készletben, különben `false`-t.

Példák:

- `contains("SCRAB", "A")` `true`-t ad vissza
- `contains("SCRAB", "Z")` `false`-t ad vissza
- `contains("", "A")` `false`-t ad vissza
