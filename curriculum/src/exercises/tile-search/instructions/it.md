---
title: "Ricerca tra le tessere"
description: "Cerca nel leggìo per trovare una lettera specifica."
en_md5: bbbc77ef2c270fd4228d6a20e690a095
---

Stai costruendo un bot per Scrabble. Prima che il bot provi a giocare una parola, deve verificare se nel proprio leggìo si trova una specifica lettera.

Il leggìo è rappresentato come una stringa di lettere (ad es. `"SCRAB"`).

Scrivi una funzione chiamata `contains` (contiene) che accetta due input:

- `haystack` (il pagliaio): il leggìo di tessere, come stringa
- `needle` (l'ago): la lettera da cercare

Restituisci `true` se la lettera si trova nel leggìo, altrimenti `false`.

Esempi:

- `contains("SCRAB", "A")` restituisce `true`
- `contains("SCRAB", "Z")` restituisce `false`
- `contains("", "A")` restituisce `false`
