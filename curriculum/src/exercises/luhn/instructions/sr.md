---
title: "Luhn"
description: "Proveri ispravnost identifikacionih brojeva, kao što su brojevi kreditnih kartica, pomoću Luhnove kontrolne sume."
en_md5: 07b0aea3adc2353e50a26e5cbe5cd162
---

Upravo smo se bavili proverom ISBN brojeva knjiga. Postoji još jedna česta formula koja se koristi za proveru brojeva u raznim kontekstima, a to je Luhnova formula (engl. _Luhn formula_). Najpoznatija je po tome što otkriva greške u kucanju brojeva kreditnih kartica.

### Luhnova provera

Luhnova provera ima nekoliko koraka:

- Počevši od **krajnje desne** cifre i krećući se ulevo, **udvostruči vrednost svake druge cifre**.
- Ako udvostručavanjem cifre dobiješ broj veći od 9, oduzmi 9 od njega.
- Zatim saberi sve cifre.
- Ako je zbir deljiv sa 10, broj je ispravan.

Na primer, za `"067"` pratimo korake:

```
0   6   7     // originalne cifre
0  12   7     // svaka druga cifra (zdesna) udvostručena
0   3   7     // 12 je veće od 9, pa oduzimamo 9 → 3
       10     // Saberemo cifre
     true     // 10 je deljivo sa 10, pa je 067 ispravan
```

### Tvoj zadatak

Napravi funkciju pod imenom `valid` (ispravan) koja prima string i vraća `true` ako broj prolazi Luhnovu proveru, a `false` ako ne prolazi.

Brojevi se zadaju kao stringovi i mogu sadržati razmake radi čitljivosti (na primer `"4539 1488 0343 6467"`). Razmake treba zanemariti.

Nekoliko važnih napomena:

- Ulaz može sadržati razmake, njih zanemari.
- Ako ulaz sadrži bilo koje druge karaktere, treba da vratiš false.
- Stringovi dužine 1 ili kraći (kada se razmaci uklone) **nisu** ispravni.

### Primeni naučeno u praksi.

Iako ovu vežbu možeš da rešiš na mnogo načina, rešenje do kojeg želimo da dođeš koristi `for` petlju.

Trebaće ti i funkcija <a href="/concepts/type-conversion" target="_blank" rel="noopener noreferrer">`Number(str)`</a> koju smo predstavili u prethodnoj vežbi.

Uživaj!
