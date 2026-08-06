---
title: "D&D bacanje"
description: "Baci nekoliko kockica i napadni goblina u D&D avanturi."
en_md5: 627f6cce99fe83ecae4e1b53051201b9
---

Praviš bota koji može da igra Dungeons and Dragons (DnD). Ako nisi upoznat sa DnD, osnovna ideja je da nailaziš na razne scenarije i bacaš kockice kako bi saznao šta se dešava. Postoji mnogo različitih kockica sa različitim brojem strana (ne samo šestostrana kocka na koju si možda navikao!)

Jedan scenario koji treba da rešiš je susret sa goblinom. Da bi napao goblina potrebno je da:

- Generiši **rezultat napada** bacanjem dvadesetostrane kockice.
- Generiši **osnovnu štetu** bacanjem dvanaestostrane kockice.
- Generiši **dodatnu štetu** bacanjem desetostrane kockice.
- Saberi osnovnu i dodatnu štetu da dobiješ **ukupnu štetu**.
- Napadni goblina koristeći rezultat napada i ukupnu štetu.

Nakon svakog bacanja kockice, treba da objaviš broj koji dobiješ ostalim igračima. Ako pokušaš da napadneš bez objavljivanja brojeva, mogli bi da pomisle da varaš!

Imaš tri funkcije koje možeš da koristiš:

- `roll(sides)` (baca kockicu sa datim brojem strana) simulira bacanje kockice sa datim brojem strana. Ova funkcija vraća (engl. _returns_) rezultat.
- `announce(value)` (objavljuje vrednost) objavljuje rezultat bacanja kockice.
- `strike(attack, damage)` (napada goblina) napada goblina koristeći tvoj rezultat napada i ukupnu štetu.

**Važno:** Svaki put kada pozoveš `roll()`, Jiki baca kockicu i dobija različit broj. Ne očekuj da ćeš bacanjem iste kockice dva puta dobiti isti broj svaki put.
