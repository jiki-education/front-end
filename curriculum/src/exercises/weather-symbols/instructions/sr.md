---
title: "Vremenski simboli"
description: "Nacrtaj šestodnevnu vremensku prognozu na osnovu niza opisa."
en_md5: 18bc1bf16ffc94d81bfa81a93faa9a7f
---

Tvoj zadatak je da napraviš šestodnevnu vremensku prognozu. Međutim, umesto uobičajenih meteoroloških podataka, šef ti daje opise vremena zasnovane na tome kako se on zbog njega oseća (npr. "Snowboarding time! 🏂" ili "Miserable 😩").

Dobijaš niz (engl. _Array_) od šest opisa vremena, po jedan za svaki dan, a tvoj posao je da vreme svakog dana nacrtaš u odgovarajuće polje.

Prognoza se prikazuje kao mreža od šest polja, po jedno za svaki dan od ponedeljka do subote. Opisi idu istim redom: prvi (polje `0`) je vreme za ponedeljak, drugi (polje `1`) za utorak, i tako redom sve do subote (polje `5`). (Nedeljom šef ne izlazi iz kuće, pa ga vreme ne zanima, tako da ga nikada i ne prikazujemo...)

## Crtanje jednog dana

Na raspolaganju ti je funkcija `draw` (nacrtaj), koja sav umetnički posao obavlja umesto tebe. Tvoj posao je da odrediš odgovarajuće elemente koje treba prikazati u polju.

```js
draw(box, day, elements)
```

- `box` je polje u koje se crta (od `0` do `5`).
- `day` je dan u nedelji kojim se polje označava, na primer `"Monday"`.
- `elements` je niz vremenskih simbola koje treba prikazati (detalji su ispod).

Dani u nedelji, redom, su `"Monday"`, `"Tuesday"`, `"Wednesday"`, `"Thursday"`, `"Friday"` i `"Saturday"`.

Dakle, ako je prvi dan `"Exciting 🤩"`, napisaćeš:

```js
draw(0, "Monday", ["cloud", "snow"])
```

## Šta svaki opis znači

Svaki opis odgovara tačno određenom nizu simbola:

- `"Sunny ☀️"`: `["sun"]`
- `"Dull 😴"`: `["cloud"]`
- `"Miserable 😩"`: `["cloud", "rain"]`
- `"Hopeful 🤞"`: `["sun", "cloud"]`
- `"Rainbow territory! 🌈"`: `["sun", "cloud", "rain"]`
- `"Exciting 🤩"`: `["cloud", "snow"]`
- `"Snowboarding time! 🏂"`: `["sun", "cloud", "snow"]`

## Tvoj zadatak

Prođi kroz niz `days` dan po dan. Svaki opis pretvori u odgovarajući niz simbola i funkcijom `draw` nacrtaj ga u polje tog dana, označeno odgovarajućim danom u nedelji.
