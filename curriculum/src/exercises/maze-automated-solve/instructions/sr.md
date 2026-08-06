---
title: "Reši lavirint programski"
description: "Napiši kod koji sam prolazi kroz bilo koji lavirint."
en_md5: d3f3c0d2727632fe7872d07e1c2cd99a
---

U prvoj vežbi sa lavirintom ručno pomeraš svog lika kroz lavirint. Sada možeš da rešiš bilo koji lavirint programski pomoću koda!

Da bi to bilo moguće, imaš tri nove funkcije:

- `canTurnLeft()` (može skrenuti levo): vraća `true` ako prostor levo od lika nije zid.
- `canTurnRight()` (može skrenuti desno): vraća `true` ako prostor desno od lika nije zid.
- `canMove()` (može krenuti napred): vraća `true` ako prostor ispred lika nije zid.

Kada to uparimo sa `move()` (pomeri napred), `turnLeft()` (skreni levo) i `turnRight()` (skreni desno) koje već poznaješ, moguće je napisati algoritam koji rešava **bilo koji** lavirint. „Algoritam“ je fensi reč koja jednostavno znači „način da se nešto uradi“. To je poput formule ili recepta.

Dalje u uputstvu, reći ću ti algoritam spreman da ga rešiš. Ali želim da prvo pokušaš samostalno da ga otkriješ kao malu logičku zagonetku. Ako znaš da li možeš da skreneš levo, desno ili da kreneš napred, kako možeš rešiti bilo koji lavirint koji ti dam?

Kad ga otkriješ, ili odustaneš, skroluj dole da vidiš odgovor i šta treba da napišeš u kodu.

<hr style="border-top: 1px solid var(--color-gray-200); margin:40px 0"/>

### Algoritam

OK, to je bio težak zahtev, pa pretpostavljam da možda imaš ideje ali još uvek ne znaš celo rešenje. Evo koraka koje treba da pratiš:

- Ako možeš da skreneš levo, skreni levo i kreni napred
- U suprotnom, ako možeš da kreneš napred, kreni napred.
- U suprotnom, ako možeš da skreneš desno, skreni desno i kreni napred.
- U suprotnom, okreni se.

Ako to uradiš, možeš rešiti bilo koji lavirint!

Napiši te instrukcije u kodu. Zabavi se!
