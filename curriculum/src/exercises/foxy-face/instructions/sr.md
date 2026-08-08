---
title: "Lisičje lice"
description: "Napravi geometrijsko lice lisice od šarenih trouglova."
en_md5: 095833a5b2117c2d26500103216bf247
---

Ova vežba te upoznaje sa `triangle` funkcijom (trougao). Koristiš je sa 7 ulaza. Prvih 6 ulaza su parovi koordinata za tri ugla. Poslednji ulaz je `color` (boja):

- `x1` (x1 koordinata), `y1` (y1 koordinata): prva ugaona tačka
- `x2` (x2 koordinata), `y2` (y2 koordinata): druga ugaona tačka
- `x3` (x3 koordinata), `y3` (y3 koordinata): treća ugaona tačka
- `color` (boja): boja trougla (npr. `"orange"`)

<img src="/static/images/exercise-assets/foxy-face/intro-triangle.webp" alt="Dijagram funkcije trougla" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

### Crtanje lisičjeg lica

Tvoj zadatak je da pomoću trouglova napraviš geometrijsko lice lisice:

<img src="/static/images/exercise-assets/foxy-face/example.svg" alt="Lisičje lice" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

Lice je horizontalno simetrično (leva strana je identična desnoj). Ima ukupno 8 trouglova:

- Dva `"white"` obraza
- Dva `"brown"` uha
- Dve `"orange"` polovine lica
- `"charcoal"` nos (dva trougla)

(Pobrini se da koristiš te boje kada crtaš trouglove, i zapamti da ih pišeš kao `string`-ove (niske)!)

Nacrtali smo obrise nekih delova za tebe da ti pomognemo da počneš. Ako pratiš redosled dat u komentarima, biće ti malo lakše.

Takođe, da bi ti bilo još lakše, svi brojevi koji se koriste su deljivi sa 5 (npr. `5`, `10`, `15` itd. su ispravni, ali `1`, `2`, `3`, `4`, `6`, `7`, `8`, `9`, `11` itd. nisu). Ovaj obrazac ćeš često sretati u narednim vežbama.

Još jedna stvar. Možeš da pređeš mišem preko prostora da pronađeš koordinate. To je sjajno za levu stranu, ali pošto je desna strana simetrična – možeš li da rešiš to bez potrebe za prelaženjem mišem?

Srećno!
