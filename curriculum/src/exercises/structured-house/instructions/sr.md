---
title: "Strukturirana kuća"
description: "Napravi crtež cele kuće koristeći samo dve promenljive kao sidra."
en_md5: 783a94e5de5f4bd22cd634e07eabc131
---

Tvoj zadatak je da nacrtaš kuću, gradeći celu stvar samo od dve sidrene promenljive: `houseWidth` (širina kuće) i `houseHeight` (visina kuće).

Postavili smo ti boje, širinu platna i dve sidrene promenljive. Sve ostalo (gde kuća stoji, krov, prozori, vrata i kvaka) treba da bude izvedeno iz ta dva sidra i fiksnih činjenica ispod.

**Razmišljaj u odnosima!** Ako uradiš kako treba, moći ćeš da promeniš samo `houseWidth` i `houseHeight`, a cela kuća će se ispravno prilagoditi: ostaće centrirana horizontalno, ostati usađena na travi i zadržaće svoje proporcije. Nemoj da ručno upisuješ pozicije koje si sam izračunao. Izvedi svaku poziciju iz sidrenih vrednosti.

<img src="/static/images/exercise-assets/structured-house/structured-house-finished.webp" alt="Ista kuća nacrtana u tri različite širine i visine, svaka centrirana i postavljena na travu" style="width: 100%; box-sizing: border-box; padding: 16px; background: #fff; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

### Specifikacije kuće

- Gornji levi ugao platna za crtanje je `0,0`. Donji desni ugao je `100,100`.
- Nebo ispunjava celo platno (od `0,0` do `100,100`).
- Trava se proteže celom širinom i nalazi se na dnu platna, visoka `15`.
- Kuća je uvek centrirana horizontalno na platnu.
- Dno kuće se nalazi `5` ispod vrha trave, a kuća raste naviše odatle.
- Krov se nalazi na vrhu okvira. Preklapa levu i desnu stranu okvira za `1/10` širine okvira, visina mu je `1/2` visine okvira, a njegov vrh je centriran horizontalno.
- Svaki prozor je širok `1/5` širine okvira i visok `1/3` visine okvira. Prozori se nalaze `1/8` visine okvira ispod vrha okvira, a od svake strane okvira su uvučeni za `1/7` širine okvira.
- Vrata su široka `1/5` širine okvira i visoka `1/2` visine okvira, centrirana horizontalno, a njihovo dno je na dnu kuće.
- Poluprečnik kvake na vratima iznosi `1/10` širine vrata. Između kvake i desne ivice vrata postoji razmak od `1/10` širine vrata. Kvaka je vertikalno centrirana na vratima.

### Proveri da li radi!

Probaj da promeniš promenljive `houseWidth` i `houseHeight`. Ako je tvoj kod ispravan, kuća će promeniti veličinu, ostajući centrirana i usađena u travu.
