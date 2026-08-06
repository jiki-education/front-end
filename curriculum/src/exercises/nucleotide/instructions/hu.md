---
title: "Nukleotid"
description: "Számold meg, hányszor fordul elő egy adott nukleotid egy DNS-szálban."
en_md5: 7ab4068481d406fdfb6f598fabd042c1
---

A DNS más vegyületek hosszú lánca, és a legfontosabb összetevői a négy nukleotid: az adenin, a citozin, a guanin és a timin. Egyetlen DNS-lánc is több milliárd ilyen nukleotidot tartalmazhat, és a sorrendjük nagyon fontos! A DNS-szekvenciát karakterekből álló stringként ábrázoljuk, például „ATTACG” – az 'A' az adenint, a 'C' a citozint, a 'G' a guanint, a 'T' a timint jelöli.

Definiálj egy `countNucleotide` (nukleotidszámláló) nevű függvényt, ami egy DNS-szálat és egy nukleotid karaktert vár, és visszaadja, hogy hányszor fordul elő az a nukleotid a szálban.

Ha a nukleotid karakter nem érvényes (nem A, C, G vagy T), akkor `-1`-et ad vissza.
Ha a szál bármilyen érvénytelen karaktert tartalmaz, szintén `-1`-et ad vissza.

Például:

- `countNucleotide("GATTACA", "A")` `3`-at ad vissza.
- `countNucleotide("GATTACA", "T")` `2`-t ad vissza.
- `countNucleotide("GATTACA", "X")` `-1`-et ad vissza.

Szükség esetén használhatod a `"...".includes(someString)` kifejezést.
