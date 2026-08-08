---
title: "Nizovi"
description: "Uređeni lanac elemenata (stringova, brojeva, Boolean vrednosti ili bilo čega drugog) koji se drži na okupu kao jedna vrednost koju Jiki može da prosleđuje."
en_md5: d26ccb9e04fbc77129f3199d63a95017
---

Već neko vreme koristiš brojeve, stringove i Boolean vrednosti, a Boolean je otmena reč za tačno i netačno. Sve njih zovemo različitim tipovima podataka (engl. _data types_). Sada dodajemo naš prvi složeni tip podataka (engl. _compound data type_).

To je tip podataka koji može da sadrži više stvari, ne samo jednu i taj tip podataka se zove niz (engl. _array_).

Kada čuješ reč niz, želim da zamisliš fizički lanac koji drži mnogo stvari na okupu.

Stvari koje lanac drži mogu biti bilo šta: stringovi, brojevi, Boolean vrednosti, čak i drugi nizovi, čak i neke stvari koje još nisi upoznao, ali nemoj sada da brineš o tome.

Sve u ovom lancu ima određeni redosled, redosled kojim su stvari povezane u lanac.

Dakle, niz sadrži mnogo stvari, ali se posmatra kao jedna celina, jedan niz sa mnogo elemenata unutar sebe.

Jiki može da uzme taj niz, taj lanac, i stavi ga u kutiju, baš kao što to radi sa stringovima i brojevima.

Može da ga ubaci u ulazni otvor mašine. Može da ga izvuče iz izlaznog otvora. Ovaj niz je jedna stvar i Jiki radi sa njim na potpuno isti način kao sa stringovima, brojevima i svim ostalim što već poznaješ.

E sada, u kodu niz takođe liči na lanac. Ima uglastu zagradu na svakom kraju, a između zagrada stavke koje su povezane u lanac, razdvojene zapetama.

Na primer, ako želimo da napravimo niz sa imenima nekih naših mentora, možemo da napravimo kutiju po imenu `mentors` (mentori) i da stavimo taj lanac u nju.

Napisali bismo `let mentors =`, potpuno isto kao i za bilo koju drugu kutiju, a zatim otvorenu uglastu zagradu, imena elemenata razdvojena zapetama, i na kraju zatvorenu uglastu zagradu. Kada Jiki ovo vidi, ode po četiri papirića, po jedan za svako ime, zatim uzme nov lanac i sve ih poveže u njega, pa taj lanac stavi u kutiju `mentors`.

U niz možeš da staviš bilo šta: stringove, brojeve, Boolean vrednosti, čak i mešavinu svega toga.

Sve su ovo primeri potpuno ispravnih nizova.

Možeš da napraviš i prazan niz. To je prosto lanac bez elemenata. I dalje predstavlja zasebnu vrednost. I dalje ima oba svoja kraja. I dalje je lanac. Samo što u njemu nema nijedne stavke. Ali i takav prazan niz možeš da staviš u kutiju, pa da ga kasnije izvadiš i iskoristiš.

Dakle, nizove pravimo pomoću uglastih zagrada, ali kako ih zapravo koristimo? Kako proveravamo šta je unutra i kako vadimo stvari napolje? Pa, na potpuno isti način na koji vadimo slova iz stringa. Možemo da koristimo uglaste zagrade sa brojevima unutra.

Hajde da se vratimo na naš spisak mentora. Ako želimo da izvadimo prvog, napišemo `mentors[0]`. Zapamti da u JavaScriptu brojimo od nule.

Kroz niz možemo i da iteriramo, na potpuno isti način kao ranije kroz stringove, pomoću `for-of` petlje.

Nizovi rade na potpuno isti način. Jedina razlika je što ovog puta, umesto slova, dobijamo ono što je stavka niza. U ovom primeru, ime mentora.

Dakle, prvi put kada se nekome zahvaljujemo, zahvaljujemo se `"DJ"`. Drugi put `"Becky"`, i tako dalje.

Na nizovima možemo da koristimo i svojstvo `length`, baš kao i na stringovima. Ako u kutiji `mentors` imamo niz sa četiri stringa i napišemo `mentors.length`, vratiće četiri.

I `includes` na nizovima radi potpuno isto. Možemo da napišemo `mentors.includes("DJ")` i vratiće `true`. Ali ako napišemo `mentors.includes("Frank")`, vratiće `false`.

Sve radi potpuno isto kao sa stringovima. Samo što sada radimo sa elementima niza, a ne sa slovima stringa.
