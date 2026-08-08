---
title: "Ekskluzivna žurka"
description: "Saznaj ko sme da uđe na veoma ekskluzivnu žurku."
en_md5: 3c03097aed9465c8f132574b033ad7ce
---

Večerašnja žurka je veoma ekskluzivna: samo ljudi čija imena počinju određenim nizom slova smeju da uđu!

Tvoj zadatak je da napišeš funkciju `handleGuest` (obradi gosta) koja prima dva ulaza:

- `name` : ime osobe na vratima
- `allowedPrefix` : potrebna početna slova za večerašnju žurku

Treba da vrati `true` ako je osobi dozvoljen ulaz, a `false` ako treba da bude odbijena.

Na primer:

- Ako je večerašnji dozvoljeni prefiks `"S"`, onda Sarah ulazi (vraća `true`), ali Brad ne ulazi (vraća `false`).
- Ako je dozvoljeni prefiks `"Brad"`, onda Brad i Bradley ulaze, ali Brian ne ulazi.

### Pomoćne funkcije

Dok radiš ovu vežbu, biće ti potrebno da izračunaš dužinu imena gosta, kao i dužinu dozvoljenog prefiksa. Ovo je savršena prilika da napraviš pomoćnu funkciju `getLength(someString)`, koja broji koliko slova ima u stringu. Zatim možeš da koristiš ovu funkciju na različitim mestima unutar `handleGuest(...)`.

Bonus scenario izaziva te da rešiš ovo sa najmanjim mogućim brojem linija. Možeš smisliti i druga rešenja koja ti se više sviđaju, koja koriste više linija. To je sasvim u redu (i ohrabrujemo te da istražuješ različite pristupe), ali pokušaj da pronađeš i najkraću verziju.

Zabavi se!
