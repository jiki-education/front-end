---
title: "Cvet koji niče"
description: "Koristi odnose između promenljivih da animiraš cvet koji raste iz zemlje."
en_md5: acd8f364af4cfdc8f76ced2b17539bbb
---

Tvoj zadatak je da napraviš cvet koji raste tokom `60` iteracija.

Animacija bi trebalo da izgleda otprilike ovako.

<img src="/static/images/exercise-assets/sprouting-flower/frames.webp" alt="Kadrovi koji prikazuju cvet kako raste iz zemlje tokom 60 iteracija" style="width: 100%; max-width: 600px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

Ključ ove vežbe je da izgradiš veze između različitih elemenata. To je ključna veština u programiranju.

**Pre nego što pročitaš ostatak uputstava**, odvoji nekoliko minuta da konceptualno osmisliš kako ovo postići. Zapiši korake za koje misliš da treba da pratiš na parčetu papira.

**Kada dobiješ rešenje** kojim si zadovoljan (ili odustaneš), **spusti se dole** da vidiš uputstva.

---

## Kako to rešiti

Ključna komponenta ovoga je centar cveta. Sve ostalo se može izračunati iz te centralne tačke. U svakoj iteraciji petlje, centralna tačka treba da se pomeri nagore za `1` (pre crtanja).

Evo još nekoliko stvari koje treba da znaš:

- Gornji levi ugao platna za crtanje je `0,0`. Donji desni je `100,100`.
- Poluprečnik cveta počinje od `0`. Treba da se povećava za `0.4` u svakoj iteraciji (pre crtanja).
- Poluprečnik tučka (srednjeg žutog dela cveta) počinje od `0`. Treba da se povećava za `0.1` u svakoj iteraciji (pre crtanja).
- Stabljika treba da počinje od centra cveta i da doseže do zemlje.
- Širina stabljike je 10% visine stabljike (dakle `stemHeight / 10` (podeli visinu stabljike sa 10)).
- Sve je centrirano na horizontalnoj osi.
- Lišće naleže uz stabljiku sa obe strane.
- Lišće se nalazi na polovini visine stabljike.
- `radiusX` (x-poluprečnik) lišća je 50% poluprečnika cveta.
- `radiusY` (y-poluprečnik) lišća je 20% poluprečnika cveta.
- Glavni deo cveta može biti `"red"` ili `"pink"` u zavisnosti od tvog ukusa. Tučak (sredina cveta) treba da bude `"yellow"`. Trava treba da bude `"green"`. Pozadina treba da bude `"skyblue"`.

**Neophodno** je raditi na jednoj stvari istovremeno:

- Počni crtanjem ružičastog cveta i neka se kreće nagore.
- Zatim učini da raste.
- Dodaj manju žutu sredinu.
- Dodaj stabljiku.
- Dodaj levi list.
- Dodaj desni list.

Koristi klizač za pregledanje koda da bi otkrio gde stvari idu po zlu.

### Ovo je teška vežba

Ovo je zahtevna vežba. Uzmi vremena. Ako zaista zapneš, traži pomoć, i ne zaboravi da nam daš puno informacija o tome šta ne radi i zašto misliš da je to slučaj.

Koristi klizač (traku za reprodukciju u donjem levom uglu) da proveriš vrednosti svojih promenljivih ako nisi siguran šta se dešava. Klikni na mali prekidač da vidiš informacije o svakoj liniji.

Zapamti, učenje je u muci. Svaki put kada nešto pogrešiš i rešiš, postaješ programer. Vremenom će ti delovati lako. Samo nastavi dalje.
