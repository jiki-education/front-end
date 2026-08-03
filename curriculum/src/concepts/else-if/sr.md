---
title: "Naredba `else if`"
description: "Nadovezivanje `else if` grana da bi se redom proverilo više uslova, pri čemu se izvršava samo prvi blok čiji je uslov tačan."
en_md5: 5e1c9b2e77abbd41708f4c33b9aabd8f
---

Već znaš kako ti `if` i `else` daju dva puta: uradi jedno kada je uslov tačan, a drugo kada je netačan. Ali šta ako imaš više od dve mogućnosti?

Zamisli da naš izbacivač sada prodaje karte. Ako imaš manje od trinaest godina, dobijaš dečju kartu. Između trinaest i dvadeset dobijaš tinejdžersku kartu. Sa dvadeset ili više, dobijaš kartu za odrasle. Sada dakle imamo tri različita ishoda. Za ovo možemo da dodamo još jednu `if` naredbu posle `else`-a. Tako možemo da kažemo: „Ako važi ovo, uradi ovo. Inače, ako važi ono, uradi ono. Inače, uradi ovu treću stvar.“ U ovom primeru, Jiki će videti `if` i proveriti prvi uslov. Da li je šesnaest manje od trinaest? Ne. Zato prelazi na `else if`. Da li je šesnaest manje od dvadeset? Da, to je tačno. Zato izvršava taj blok i izdaje tinejdžersku kartu. Ali tu je gotov. Ne proverava ništa dalje. Onaj poslednji `else` uopšte i ne gleda. Čim Jiki nađe uslov koji je tačan, izvrši taj blok i preskoči sve ispod njega.

```javascript
if (age < 13) {
  childTicket()
} else if (age < 20) {
  teenTicket()
} else {
  adultTicket()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/else-if/tickets.webp"
  alt="Tri karte sa oznakama CHILD, TEEN i ADULT, po jedna za svaki ishod provere godina"
  width="500"
  height="142"
/>

Ovo je ključna stvar koju treba razumeti. Uvek se izvršava samo jedan blok. Jiki ide niz ovaj lanac, nađe prvi tačan uslov, izvrši taj blok i nastavlja dalje.

E sad, postoji jedna stvar koju zaista treba razumeti, jer ovde mnogi zapnu. Postoji suptilna, ali veoma važna razlika između pisanja dve odvojene `if` naredbe i korišćenja `else if`. Zamisli da pravimo program koji dodeljuje ili osnovnu ili bonus nagradu, u zavisnosti od nečijeg rezultata. Pogledaj ove dve mogućnosti. Jedna koristi `else if`, a druga dve odvojene `if` naredbe. Šta će se desiti drugačije?

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

U prvom slučaju, sa `else if`, proverimo da li je rezultat visok i damo bonus nagradu, a `else if` deo onda ne izvršavamo. Dakle, ako neko ima rezultat preko sto, dobija samo bonus nagradu.

Ali u drugom primeru, ta dva `if`-a su potpuno nezavisna. Oba će se izvršiti i oba uslova će biti tačna. Zato ovde osoba dobija dve nagrade. U prvom primeru jednu nagradu, u drugom dve. Zastani na trenutak i uveri se da ti je ovo zaista jasno.

Zanimljivo je i to da oba pristupa mogu biti ispravna, u zavisnosti od toga kako je igra zamišljena. Možda takmičar dobija i običnu i bonus nagradu, a možda samo prelazi na bonus nagradu. Nijedan od ova dva primera koda nije ni ispravan ni pogrešan. Prosto su korisni u različitim situacijama. Ali moraš da znaš koji od njih nameravaš da koristiš.
