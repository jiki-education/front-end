---
title: "Pogledaj oko sebe"
description: "Napravi funkcije koje proveravaju šta se nalazi oko tebe u lavirintu."
en_md5: 9ca44b407519cf6b3d5fa9f3f0e3b3d3
---

Prošli put si dodao novu funkciju koja pomaže u kretanju kroz lavirint: `turnAround()` (okreni se). Sa leve strane imaš svoj kod na kojem ćeš nastaviti da radiš.

Ovog puta smo uklonili tri funkcije na koje se oslanjaš. Tvoj posao u ovoj vežbi je da ih sam implementiraš!

### Funkcije koje treba da napišeš

Tri funkcije koje treba da napraviš su `canTurnLeft()` (može da skrene levo), `canTurnRight()` (može da skrene desno) i `canMove()` (može da se pomeri).

Nijedna od ovih funkcija nema ulaze. Sve one treba da vrate boolean vrednost koja označava da li je moguće pomeriti se u tom pravcu.

Da bismo ti pomogli, dodali smo novu funkciju `look(direction)` (pogled u pravcu). Ova funkcija prima jedan ulaz - pravac koji može biti `"left"`, `"right"` ili `"ahead"`. Ona vraća jednu od sledećih vrednosti:

- `"start"` (Gde počinješ)
- `"target"` (Gde pokušavaš da stigneš)
- `"empty"` (Slobodan put napred!)
- `"fire"` (Vatra - pazi!)
- `"poop"` (Fuj!)
- `"wall"` (Zid - au!)

### Napomene koje ti mogu pomoći

Evo tri napomene koje ti mogu pomoći.

1. Dobra praksa u ovakvoj vežbi je da **počneš kreiranjem funkcija** koje su potrebne da bi se kod izvršio (tj. `canTurnLeft()`, `canTurnRight()` i `canMove()`). Postavi njihove povratne vrednosti na neku razumnu podrazumevanu vrednost (u ovom slučaju `true` ili `false`). Zatim možeš da implementiraš logiku svake funkcije i da napreduješ svaki put, umesto da stalno dobijaš grešku da funkcija ne postoji sve dok ne napišeš ceo program.
2. **Ne bi trebalo da menjaš ništa od svog postojećeg koda** za ovu vežbu. Umesto toga, dodaj tri funkcije na vrh koda.
3. Možeš da napišeš **više funkcija** od samo onih koje su potrebne, ako ti to pomaže.
