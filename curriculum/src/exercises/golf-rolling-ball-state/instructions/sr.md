---
title: "Loptica sa stanjem"
description: "Zakotrljaj lopticu za golf u rupu tako što pratiš njenu poziciju."
en_md5: e3c9b61e57c7e245a7c4624433879471
---

Ponovo smo u svetu pravljenja golf igre, ali ovog puta ono što pravimo je drugačije.

Umesto funkcije `roll()` (kotrljati) koju smo imali ranije, sada imamo funkciju `moveTo(position)` (pomeri na poziciju) koja trenutno pomera lopticu na određeno mesto.

Kada igrač udari lopticu, mogli bismo je odmah pomeriti direktno na krajnje mesto, ali nije nimalo zadovoljavajuće videti je bez animacije. Zato umesto toga želimo da iskoristimo `moveTo(position)` mnogo puta kako bismo postigli da izgleda kao da se kotrlja.

Loptica počinje na poziciji **28** i treba da stigne do pozicije **88**.

Moraš ovo rešiti u **5 linija koda**. Srećno!
