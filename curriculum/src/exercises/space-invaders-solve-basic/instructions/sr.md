---
title: "Space Invaders"
description: "Obori nekoliko vanzemaljaca u svom prvom susretu sa Space Invaders."
en_md5: 56b9b22488ae091b5f06cb5afc5bb441
---

Dobro došli u svoju drugu vežbu - Space Invaders! Ovo je klasična arkadna igra iz sedamdesetih, i jedna od prvih koje sam ikada igrao. U narednim nedeljama ćeš napraviti potpuno automatizovani laser koji će oboriti vanzemaljce. Ali za sada, tvoj zadatak je samo da ručno oboriš sve vanzemaljce!

Imaš dve funkcije (engl. _functions_):

- `move()` (pomeri top) pomera tvoj laserski top za jedno mesto udesno.
- `shoot()` (pucaj) ispaljuje laser nagore.

Prvi poziv `move()` smo već napisali za tebe. **Pogledaj gde se nalaze vanzemaljci**, a zatim napiši niz poziva `move()` i `shoot()` da ih sve uništiš.

Pazi:

- Ako pucaš kada nema vanzemaljca iznad tebe, dobićeš grešku (engl. _error_) (na kraju krajeva, trošenje municije nije dozvoljeno!).
- Ako se pomeriš sa desne ivice ekrana, dobićeš grešku.

Zabavi se!
