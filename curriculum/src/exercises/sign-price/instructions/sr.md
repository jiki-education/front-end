---
title: "Cena znaka"
description: "Izračunaj cenu farbanja znaka, slovo po slovo."
en_md5: 67d90aae9a896a879c20956e9afc9270
---

Vodiš radnju za izradu znakova. Naplaćuješ 12 dolara po slovu za svaki znak koji napraviš. Razmaci su besplatni (ne naplaćuju se).

Napiši funkciju pod nazivom `signPrice` (cena znaka) koja prima tekst za znak i vraća formatiranu poruku sa ukupnom cenom. String je `"That will cost "` („To će koštati”) nakon čega sledi cena. Na primer:

- `signPrice("Burgers")` (7 slova) treba da vrati `"That will cost $84"`
- `signPrice("Frank's Hotdogs")` (14 slova, razmak preskočen) treba da vrati `"That will cost $168"`

Zabavi se!
