---
title: "Jednostavni pangram"
description: "Proveri da li rečenica sadrži svako slovo abecede."
en_md5: 50b09bb1fbd35081cb842c55fc40e313
---

Pangram je rečenica koja koristi **svako slovo abecede barem jednom**. Najpoznatiji engleski pangram je "the quick brown fox jumps over the lazy dog"!

Naredne tri vežbe sve će biti o tome kako da odrediš da li su rečenice pangrami.

U ovoj prvoj vežbi treba da rukuješ samo malim slovima. Ulaz će sadržati samo mala slova i druge karaktere poput razmaka, brojeva ili interpunkcije, ali ne i velika slova.

Tvoj zadatak je da napišeš `isPangram(sentence)` (funkciju koja proverava da li je data rečenica pangram), koja kao ulaz prima rečenicu i vraća `true` ako rečenica sadrži svako slovo od "a" do "z" barem jednom, ili `false` ako ne sadrži.

### Pomoćne funkcije

Da bi prošao ovu vežbu, nije ti dozvoljeno da koristiš ugnježđene petlje. Umesto toga, kao u prošloj vežbi, ključ je da napraviš **pomoćnu funkciju** koju `isPangram(...)` koristi.

Ova pomoćna funkcija pomoći će ti da odrediš da li jedan string sadrži drugi string. Preporučujemo da ovu funkciju nazoveš `includes`, a njene parametre `haystack` (plast sena) i `needle` (igla). Ideja je da želimo da "nađemo iglu u plastu sena" — stara engleska fraza.

Ako ti stvaranje više funkcija deluje previše, možeš prvo da rešiš vežbu bez pomoćne funkcije, koristeći ugnježđenu petlju, a zatim da razmisliš kako da to razbiješ u pomoćnu funkciju.

Zabavi se!
