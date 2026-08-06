---
title: "Tabla za dame"
description: "Nacrtaj tablu za dame bilo koje veličine i pripremi je za igru, tako što ćeš svaku poziciju izvesti iz veličine table."
en_md5: 1669c45c882ce94e16651bfc2d77a172
---

U ovom projektu nacrtaćeš tablu za dame i postavićeš figure na nju, spremno za partiju dame (poznate i kao „checkers“).

Tvoj kôd treba da radi za **bilo koju veličinu table**. Dali smo ti tri primera table da isprobaš. Jedan zadatak koristi klasičnu tablu 8x8, drugi manju 6x6, a treći veću 10x10. Možeš da koristiš `getBoardSize()` (dohvata veličinu table) da saznaš koliko je tabla široka i visoka ovog puta (table su uvek kvadratne).

<div style="display: flex; gap: 8px; margin: 12px 0;">
  <img src="/static/images/exercise-assets/checkerboard/board-6.svg" alt="Tabla za dame 6x6" style="width: 33.333%; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);" />
  <img src="/static/images/exercise-assets/checkerboard/board-8.svg" alt="Tabla za dame 8x8" style="width: 33.333%; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);" />
  <img src="/static/images/exercise-assets/checkerboard/board-10.svg" alt="Tabla za dame 10x10" style="width: 33.333%; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);" />
</div>

### Tabla

Kao i obično, platno je uvek široko `100` i visoko `100`. Prati ova dva pravila:

- Tabla ima ivicu `"black"` boje oko ruba, širine `2`.
- Polja treba da se smenjuju između `"dark brown"` i `"white"`, ravnomerno deleći prostor unutar ivice. Donje levo polje je uvek tamno braon, ne belo.

### Figure

Svaka figura se nalazi u središtu polja.

- Figure su krugovi sa izraženim ivicama, sa spoljnjim obrubom i unutrašnjom bojom:
  - Cela figura je široka 80% širine polja.
  - Unutrašnji krug je širok 75% širine cele figure.
- Redovi na **vrhu** table dobijaju `"charcoal"` figure (svaka sa `"black"` obrubom).
- Redovi na **dnu** table dobijaju `"white"` figure (svaka sa `"grey"` obrubom).
- Figure stoje isključivo na **tamnim** poljima.
- **Srednja dva reda** se uvek ostavljaju prazna. Svi ostali redovi imaju figure na sebi.

## Razmišljaj u odnosima

Suština ove vežbe je da **nikada unapred ne postavljaš fiksne** veličine i pozicije. Izračunaj jednu veličinu polja na osnovu veličine table, pa iz nje napravi svako polje i svaku figuru. Ako to uradiš kako treba, potpuno isti kôd će nacrtati i malu tablu 6x6 i veću 10x10, bez potrebe da menjaš ijedan broj.
