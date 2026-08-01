---
title: "Naredba `if`"
description: "Korišćenje ključne reči `if` da se blok koda izvrši samo kada je neki uslov tačan, kao kada izbacivač odlučuje koga će pustiti unutra."
en_md5: 8797e078e1ad90b7652373baf6f96f28
---

Postoji ključna reč koja nam pomaže da kažemo Jikiju da nešto uradi samo u određenim situacijama. Možda pišeš kod koji čuva ulaz u bar, recimo da si izbacivač, i Jiki treba da otvori vrata samo ako je neko prikladno obučen. Ili možda pišeš kod u kome si zadužen da mahneš kariranom zastavicom na kraju trke, ali Jiki mora da zna da to treba da uradi samo u poslednjem krugu. U ovakvim situacijama koristićemo ključnu reč `if`.

<img
  class="concept-image"
  src="/static/images/concept-assets/if/bar-door-scenario.webp"
  alt="Jiki kao izbacivač odlučuje da li da pusti ljude u noćni klub"
  width="292"
  height="400"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/if/waving-flag.webp"
  alt="Jiki spreman da mahne kariranom zastavicom na kraju trke"
  width="266"
  height="400"
/>

Ključnu reč `if` koristimo vrlo slično kao i `repeat`. U obične zagrade stavljamo neku informaciju. U ovom slučaju, ta informacija je uslov (engl. _condition_) koji proveravamo. A zatim u vitičaste zagrade stavljamo blok koda koji se izvršava samo ako je taj uslov tačan.

```javascript
if (condition) {
}
```

Pa kako ti uslovi izgledaju? Obično su to neka vrsta poređenja (engl. _comparison_). Uporedimo dva broja ili dva stringa i proverimo da li je rezultat tačan ili netačan.

Zamisli ih kao iskaze (engl. _statements_) koje možeš da izgovoriš naglas. Tri je manje od pet. To je tačno. Sedam je manje od dva. To je netačno.

Za zapisivanje ovih poređenja koristimo simbole. Verovatno su ti već poznati iz matematike. Imamo manje od, veće od, manje ili jednako, veće ili jednako, a imamo i proveru da li su dve stvari iste, da li su jednake. Ta provera je malo drugačija nego što verovatno očekuješ, jer pišemo tri znaka jednakosti zaredom da bismo proverili da li su dve stvari iste ili različite.

<img
  class="concept-image"
  src="/static/images/concept-assets/if/comparisons-symbols.webp"
  alt="Tabela operatora poređenja: manje od, veće od, manje ili jednako, veće ili jednako, jednako i različito, sa primerima"
  width="449"
  height="400"
/>

A to nam pomaže da se ne pomešamo sa situacijama kada postavljamo ili menjamo promenljive, gde znak jednakosti znači stavi ovo u kutiju. Samo zapamti: tri znaka jednakosti za poređenje.

Možeš da porediš i stringove. Dakle, `"hello"` jednako `"hello"`. To je tačno. Ta dva stringa su ista. Ali ovde budi na oprezu, jer Jiki poredi svaki pojedinačni karakter (engl. _character_) u oba stringa, na oba papirića. Zato `"Hello"` sa velikim H nije jednako `"hello"` sa malim h. To su različiti stringovi. Njihovo poređenje bi zato bilo netačno, jer su veliko H i malo h različiti karakteri.

Uzgred, tačno i netačno se zovu _Booleans_ (logičke vrednosti), što je još jedna reč koja zvuči tehnički. Ali zapravo je vrlo jednostavna. To je samo formalan način da se kaže da je nešto ili tačno ili netačno. Pa ako naiđeš na reč Boolean, to prosto znači tačno ili netačno. Hajde da vidimo ovo na delu. Zamisli da pravimo tog robota izbacivača za klub, i reći ćemo da izbacivač treba da otvori vrata samo ako osoba ima 21 godinu ili više. Imamo funkciju `askAge` (pitaj za godine), kojom možemo da saznamo nečije godine, a njen rezultat ćemo sačuvati u promenljivoj po imenu `age` (godine). Onda možemo da kažemo: ako je `age` veće od 20, otvorićemo vrata. Dakle, ako `askAge` vrati `30`, otvaramo ih, a ako vrati `12`, ne otvaramo.

```javascript
let age = askAge()
if (age >= 21) {
  openDoor()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/if/bouncer-open-close.webp"
  alt="Jiki otvara vrata osobi koja ima dovoljno godina, a ne pušta unutra osobu koja je premlada"
  width="410"
  height="400"
/>
