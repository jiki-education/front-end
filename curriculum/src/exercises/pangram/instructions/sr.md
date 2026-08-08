---
title: "Pangram"
description: "Proveri da li rečenica sadrži svako slovo abecede, bez obzira na veličinu slova."
en_md5: 8fae2df6ec4385478e4236fa49e21256
---

Dobrodošli u drugi deo serijala o Pangramu. Seti se, pangram je rečenica koja koristi svako slovo abecede bar jednom.

Ova vežba je složenija verzija prethodne pangram vežbe, jer uključuje i velika slova. To dodaje iznenađujuće mnogo složenosti.

Kreiraj funkciju koja se zove `isPangram` (provera da li je rečenica pangram) koja prima rečenicu kao string, i vraća boolean vrednost koja pokazuje da li jeste, ili nije, pangram.

Dali smo ti tvoj prethodni kod kao početnu tačku.

### Pomoćne funkcije

Pored tvoje postojeće pomoćne funkcije (za koju smo predložili da je nazoveš `includes`), preporučujemo ti da kreiraš dve nove pomoćne funkcije koje će ti pomoći da ovo rešiš. Imena ovih funkcija su standardna i preporučujemo da ih se držiš:

1. `indexOf(haystack, needle)`: Funkcija koja izračunava **gde** se igla nalazi u plastu sena. Dakle, umesto da vraća `true`/`false` kao `includes`, ona vraća **indeks** igle. Na primer, `indexOf("Jeremy", "r")` bi vratilo `2` (zapamti da brojimo od 0).
2. `toLowerCase(someString)`: Funkcija koja prima string i vraća ga konvertovanog u mala slova. Na primer, `toLowerCase("JeReMy")` bi vratilo `"jeremy"`.

Zabavi se!
