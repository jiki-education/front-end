---
title: "`for` petlje"
description: "Petlja sa tri dela (inicijalizatorom, uslovom i uvećanjem) koja ti daje potpunu kontrolu nad iteracijom."
en_md5: e96f2e5a4106a88cfbca449c93a26108
---

Možda se sećaš da repeat petlja zapravo ne postoji u JavaScriptu. To je samo nešto što smo dodali da ti malo olakšamo život dok se zagrevamo.

Pa šta onda koristimo umesto nje? Koristimo običnu `for` petlju, a ona izgleda ovako.

```javascript
for (let i = 0; i < 5; i++) {
  // ...
}
```

Sad ti je jasno zašto je ovo prvog dana moglo da deluje pomalo zastrašujuće.

Ali sada imaš sve znanje koje ti je potrebno da se navikneš na ovo. Zato hajde da je raščlanimo.

`for` petlja ima tri dela: inicijalizator (engl. _initializer_), uslov i uvećanje (engl. _increment_).

Inicijalizator, ovaj deo `let i = 0`, izvršava se na početku cele petlje. Izvrši se samo jednom, i ovde pravi kutiju po imenu `i` postavljenu na nulu. `i` je samo slovo koje koristimo da pratimo vrednost dok se petlja vrti, i tradicionalno se za to koriste `i` ili `x`.

Sledeći deo, uslov, izvršava se svaki put pre svake iteracije petlje.

Ako je uslov tačan, petlju izvršavamo ponovo.

Ako nije, ne izvršavamo je.

I na samom kraju dolazi uvećanje, ono `i++`.

`i++` znači isto što i `i = i + 1`. To je samo skraćeni zapis, način da se `i` svaki put uveća za jedan.

Dakle, u ovom primeru postavićemo `i` na nulu. Proverimo da li je `i` manje od dva, a jeste, pa izvršimo petlju.

A onda na kraju uvećamo `i` za jedan, pa `i` postane jedan. Nula plus jedan je jedan.

I onda idemo ponovo. Proveravamo da li je jedan manje od dva.

Jeste, pa izvršimo petlju. A onda na kraju ponovo uvećamo `i`. Sada je dva, jedan plus jedan jednako je dva.

```javascript
i = 0
i < 2 // true - izvršavamo petlju
...   // Radimo iteraciju
i = i + 1 // 1

i < 2 // true - izvršavamo petlju
...   // Radimo iteraciju
i = i + 1 // 2

i < 2 // false - izlazimo iz petlje
```

I onda idemo treći put. Ovog puta proveravamo da li je dva manje od dva, a nije, pa petlju ne izvršavamo, i sa petljom smo, zapravo, gotovi. Samo prelazimo na kod koji sledi ispod. Dakle, petlja se izvršila dvaput, i to je korisno znati. Sve dok krećemo od nule i imamo uslov `i < n`, broj `n` je broj koliko će se puta petlja izvršiti.

Dakle, ovo je isto kao da kažeš repeat dva.

Znači, nije teško, ali je mnogo zamršenije nego da samo napišeš repeat dva. Prednost `for` petlje je u tome što u ta tri mesta možeš da staviš bilo šta. Možeš da kreneš od drugog broja, da brojiš naviše za više od jedan, da brojiš unazad, ili da koristiš uslov koji zavisi od nečeg drugog, a ne od običnog brojača. Ta fleksibilnost je ono što `for` petlje čini pravim radnim konjem JavaScripta.
