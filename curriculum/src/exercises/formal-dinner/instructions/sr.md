---
title: "Formalna večera"
description: "Pronađi za kojim stolom gost sedi na osnovu rasporeda sedenja."
en_md5: b93bf1949411dbc2a19e5b48c3ae869a
---

Vraćaš se svom sporednom poslu izbacivača. Veče je posle After Party, a tu je i još jedna fešta. Ovog puta je to formalna večera, pa si večeras manje „nabildovan tip na vratima“ a više „osoba sa klipbordom i finim prslukom“.

Ovde definitivno nije mesto gde se koristi **samo** ime. Zapravo, ovde se uopšte ne koristi ime. Ovde se svi oslovljavaju oslovljavanjem (engl. _honorific_) (gospođica, gospodin, dr, itd) i prezimenom.

Organizatori su ti dali raspored sedenja u vidu dve odvojene liste. Jedna sadrži puna imena gostiju. Druga sadrži ime stola za kojim svaki gost sedi (nazvanog po drveću i cveću). Kao i kod „After Party“, te dve liste su usklađene: gost na poziciji 3 u prvoj listi sedi za stolom na poziciji 3 u drugoj listi.

Zato kad gospodin Pitt uđe, treba da shvatiš da je to „Brad Pitt“ sa tvoje liste i da mu kažeš za kojim stolom je.

Napiši funkciju pod nazivom `tableFor` (pronalazi za kojim stolom gost sedi). Funkcija ima tri ulaza:

- Prvi je lista punih imena gostiju, kao stringovi
- Drugi je lista imena stolova, u istom redosledu kao gosti
- Treći je gost koji dolazi, formatiran kao oslovljavanje iza kog sledi prezime (npr. "Mr Pitt")

Vrati ime stola za kojim gost sedi. Ako ga uopšte nema na rasporedu sedenja, vrati string `"No table found"` (nema uljeza!).

Oslovljavanje je uvek tačno jedna reč, a sve posle nje je prezime gosta. Većina prezimena je od jedne reči, ali nekolicina velikih se prostire na dve reči.

Ipak, budi oprezan. Mnogo prezimena liči na druga prezimena.

### String/Array Methods & Properties

Pored svojstva `.length` koje si naučio u prošloj vežbi, postoje četiri metode koje bi ti mogle biti korisne. Postoji mnogo načina da se reši ova vežba, ali ove će te dovesti do najkraćeg mogućeg rešenja.

`"...".split(substring)` deli string korišćenjem drugog stringa. Na primer:

```js
`"Jeremy".split("e")`
// ["J", "r", "my"]
```

`[...].slice(start)` hvata deo niza, počev od indeksa `start` pa do kraja niza. Uhvaćeni elementi se kopiraju u NOVI niz, koji ti se vraća. U stvari, ovim se odbacuje prvih `start` elemenata. Na primer:

```js
["Jeremy", "Erik", "Aron", "DJ", "Glenn", "Isaac", "Bethany"].slice(2)
// ["Aron", "DJ", "Glenn", "Isaac", "Bethany"]
```

`[...].join(string)` spaja elemente niza pomoću datog stringa. Na primer:

```js
["Jeremy", "Erik", "Aron", "DJ", "Glenn", "Isaac", "Bethany"].join(" likes ")
// Jeremy likes Erik likes Aron likes DJ likes Glenn likes Isaac likes Bethany
```

`"...".endsWith(string)` ti kaže da li se string završava drugim stringom. Na primer:

```js
"Jeremy".endsWith("emy")
// true

"Jeremy".endsWith("Jer")
// false
```
