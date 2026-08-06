---
title: "Nukleotid"
description: "Prebroji koliko se puta određeni nukleotid pojavljuje u lancu DNK."
en_md5: 7ab4068481d406fdfb6f598fabd042c1
---

DNK je dugačak lanac drugih hemikalija, a najvažniji su četiri nukleotida: adenin, citozin, guanin i timin. Jedan lanac DNK može da sadrži milijarde ovih četiriju nukleotida, a redosled kojim se pojavljuju je važan! DNK sekvencu predstavljamo kao niz karaktera, na primer „ATTACG“. 'A' za adenin, 'C' za citozin, 'G' za guanin i 'T' za timin.

Napravi funkciju pod nazivom `countNucleotide` (prebroj nukleotide) koja prima lanac DNK i jedan karakter nukleotida, a vraća broj koliko se puta taj nukleotid pojavljuje u lancu.

Ako karakter nukleotida nije validan (nije jedno od A, C, G, T), vrati `-1`.
Ako lanac sadrži bilo koji nevalidan karakter, takođe vrati `-1`.

Na primer:

- `countNucleotide("GATTACA", "A")` vraća `3`
- `countNucleotide("GATTACA", "T")` vraća `2`
- `countNucleotide("GATTACA", "X")` vraća `-1`

Ako ti zatreba, možeš da koristiš `"...".includes(someString)`.
