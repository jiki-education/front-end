---
title: "Else"
description: "Dodavanje `else` klauzule posle `if`-a, tako da se drugi blok koda izvrši kada se ispostavi da je uslov netačan."
en_md5: 4dd08e94d86dd11cd54793cf64008e3d
---

Pomoću if naredbi možeš da proveriš uslove i izvršiš kod samo kada je nešto tačno. Hajde da sada upoznamo if-ovog saučesnika, `else`.

Kod if naredbe (engl. _if statement_), Jiki izvršava blok koda kada je uslov tačan, a preskače taj blok koda kada je netačan. Ali šta ako želiš da Jiki uradi jednu stvar kada je uslov tačan, a drugu kada je netačan? Upravo tome služi else. Možemo da stavimo else klauzulu (engl. _else clause_) posle zatvorene vitičaste zagrade if-a, i Jiki će je izvršiti ako je uslov if-a netačan. Ako se vratimo na primer sa izbacivačem u klubu, sada imamo mogućnost da otvorimo vrata ili da nekoga odbijemo, što je verovatno bolje nego da ga potpuno ignorišemo kao do sada. Zamisli to kao račvanje na putu. Jiki stigne do tog račvanja, proveri uslov, i onda može da krene jednim putem ako je tačan, ili drugim ako je netačan. Ali nikada ne ide na obe strane.

```javascript
if (age >= 21) {
  openDoor()
} else {
  turnAway()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/else/fork-in-the-road.webp"
  alt="Račvanje na putu ispred vrata kluba: otvori vrata kada je uslov tačan, odbij osobu kada je netačan"
  width="500"
  height="332"
/>

Ali šta ako imaš više od dve mogućnosti? Zamisli da naš izbacivač prodaje karte. Ako imaš manje od trinaest godina, dobijaš dečju kartu. Između trinaest i dvadeset, dobijaš tinejdžersku kartu. Sa dvadeset ili više, dobijaš kartu za odrasle. Dakle, sada imaš tri različita ishoda. Za ovo možemo da dodamo još jednu if naredbu posle else-a. Znači, možemo da kažemo: „Ako je ovo, uradi ovo. Inače, ako je ono, uradi ono. Inače, uradi ovu treću stvar.“ U ovom primeru, Jiki će videti if i proveriti prvi uslov. Da li je šesnaest manje od trinaest? Nije. Zato prelazi na else if. Da li je šesnaest manje od dvadeset? Jeste, to je tačno. Zato izvršava taj blok i daje tinejdžersku kartu. Ali tu je gotov. Ne proverava ništa više. Uopšte ne gleda onaj poslednji else. Čim Jiki nađe uslov koji je tačan, izvrši taj blok i preskoči sve ostalo ispod njega.

```javascript
if (age < 13) {
  childTicket()
} else if (age < 20) {
  teenTicket()
} else {
  adultTicket()
}
```

Ovo je ključna stvar koju treba razumeti. Uvek se izvrši samo jedan blok. Jiki ide redom niz ovaj lanac, nađe prvi tačan uslov, izvrši taj blok i nastavi dalje.

E sad, postoji jedna stvar koju treba zaista razumeti, jer tu se ljudi često spotaknu. Postoji suptilna, ali veoma važna razlika između pisanja dve odvojene if naredbe i korišćenja else if-a. Zamisli da pravimo program koji daje ili osnovnu ili bonus nagradu, u zavisnosti od nečijeg rezultata. Pogledaj ove dve mogućnosti. Jedna koristi else if, a druga dve odvojene `if` naredbe. Šta će se desiti drugačije?

```javascript
if (score > 100) {
  bonusPrize()
} else if (score > 50) {
  basicPrize()
}
```

```javascript
if (score > 100) {
  bonusPrize()
}
if (score > 50) {
  basicPrize()
}
```

U prvom slučaju, sa else if-om, proveravamo da li je rezultat visok i dajemo nagradu, a else if se onda ne izvršava. Dakle, osoba čiji je rezultat preko sto dobija samo bonus nagradu.

Ali u drugom primeru, dva if-a su potpuno nezavisna. Oba će se izvršiti i oba će biti tačna. Znači, osoba ovde dobija dve nagrade. U prvom primeru, jednu nagradu. U drugom, dve. Zastani na trenutak i uveri se da ovo zaista razumeš.

Zanimljivo je i to da oba mogu biti ispravna, u zavisnosti od toga kako je igra osmišljena. Možda takmičar dobija i običnu i bonus nagradu, a možda samo prelazi na bonus nagradu. Nijedan od ova dva koda nije ni ispravan ni pogrešan. Samo su korisni u različitim situacijama. Ali moraš da znaš koji od njih nameravaš da koristiš.
