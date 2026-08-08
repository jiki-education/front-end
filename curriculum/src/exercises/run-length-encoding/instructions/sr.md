---
title: "Run-length kodiranje"
description: "Kompresuj i dekompresuj tekst brojanjem ponavljanja istih znakova."
en_md5: a176be7e6ed782e9aa4b54a4575f751f
---

Run-length kodiranje (engl. _run-length encoding_) je jednostavan oblik kompresije. Nizovi istog znaka koji se ponavljaju u nizu zamenjuju se brojem ponavljanja, a zatim tim pojedinačnim znakom. Znakovi koji se pojave samo jednom ostaju kakvi jesu, bez broja ispred njih.

Na primer, `"AABBBCCCC"` se kodira u `"2A3B4C"`, a `"XYZ"` (bez ponavljanja) se kodira u samo `"XYZ"`.

Praznine se računaju kao i svaki drugi znak, pa se `"  hsqq qww  "` kodira u `"2 hs2q q2w2 "`.

### Dve funkcije

Napiši dve funkcije:

- `encode` (kodiraj) prima string i vraća njegovu run-length kodiranu formu.
- `decode` (dekodiraj) prima kodirani string i vraća originalni tekst nazad.

Dekodiranje obrće postupak: broj ti govori koliko puta treba da ponoviš znak koji sledi za njim. Zapamti da niz istih znakova može biti duži od 9, pa broj može imati više od jedne cifre (na primer, `"12W"` znači dvanaest `W`-ova).

### Primeni stečeno znanje u praksi

Iako postoji mnogo načina da rešiš ovu vežbu, rešenje do kog želimo da dođeš koristi tip `for` petlje koji smo obradili u prošlom videu. Proveri koncepte pri dnu stranice ako ti treba podsetnik za sintaksu, jer je prilično ružna!

Zabavi se!
