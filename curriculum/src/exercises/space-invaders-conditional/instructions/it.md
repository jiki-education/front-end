---
title: "Space Invaders: condizionale"
description: "Spara solo quando c'è un alieno nel tuo mirino."
en_md5: 4a603e339af722e912ab2ff9b25cc287
---

Gli alieni hanno cambiato formazione! Ora sono disposti su due file, ma non tutte le colonne hanno un alieno.

Hai a disposizione tre funzioni:

- `move()` (muovi) sposta il tuo cannone laser di una posizione a destra
- `shoot()` (spara) spara il laser verso l'alto
- `isAlienAbove()` (c'è un alieno sopra) restituisce `true` se c'è un alieno sopra di te, altrimenti `false`

Devi spostarti lungo lo schermo, controllando ogni posizione. Se c'è un alieno sopra di te, sparagli! Altrimenti, vai avanti.

**Non sparare quando non c'è un alieno sopra di te, o perdi!**
