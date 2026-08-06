---
title: "Iteriranje kroz stringove"
description: "Upotreba `for of` petlje za prolazak kroz svako slovo u stringu, obavljajući nešto sa svakim od njih."
en_md5: 584ac0a187a9e5244b84f0fd417494f3
---

Pomoću uglastih zagrada možeš da pristupiš pojedinačnom slovu u stringu. Sada ćemo pogledati kako da prođemo kroz string, izvlačeći svako slovo jedno po jedno.

A da bismo to uradili, potreban nam je novi tip petlje. Do sada smo koristili `repeat` petlju, a sada ćemo da upotrebimo nešto što se zove `for of` (petlja koja prolazi kroz svaki element kolekcije) petlja. To su dve nove ključne reči, `for` i `of`.

Ključnu reč `for` ćemo sretati na dosta mesta kako budemo napredovali. Može da stoji sama, ili u paru sa `in` ili `of`. Za sada ćemo se fokusirati na ovu poslednju, `of`.

Hajde da pogledamo neki kod.

Počećemo tako što ćemo napraviti promenljivu pod nazivom `name` (ime) koja sadrži string `"Jeremy"` (ime Džeremi). Ništa novo ovde.

Onda imamo liniju sa petljom, i dosta toga se tu dešava, pa hajde da polako prođemo kroz nju.

```javascript
let name = "Jeremy"
for (let letter of name) {
  // ...
}
```

Najpre imamo ključnu reč `for`. Ona govori Jikiju da želimo da napravimo neku petlju. Zato on pogleda napred, vidi `of` i zna da želimo da napravimo „for of“ petlju.

A to znači da, umesto da koristimo `repeat` petlju gde kažemo „Hajde da prođemo kroz 10 ponavljanja,“ kažemo „Hajde da prođemo kroz sva slova u stringu.“ To je ono što „for of“ znači.

Zatim imamo ovaj deo `let letter` (slovo). To je potpuno isto kao ono iznad sa `let name`. Samo pravimo promenljivu pod nazivom `letter`.

Razlika je u tome što, umesto da eksplicitno kažemo šta ide u nju, govorimo Jikiju da u nju stavlja svako slovo iz stringa, jedno po jedno.

Tako da Jiki vidi `for`, proveri `of` i krene. Pogleda prvo slovo u stringu, u ovom slučaju `"J"`, i stavi ga u novu kutiju pod nazivom `letter`. Inače, mogli smo da je nazovemo bilo kako. Ne mora biti `letter`. Mi smo ovde jednostavno odlučili da je nazovemo `letter`.

Onda izvrši kod unutar vitičastih zagrada, a tu možeš da radiš sve što bi radio i bilo gde drugde u kodu. Jedina razlika je u tome što će se ovaj blok koda izvršiti po jednom za svako slovo u stringu, i imaće na raspolaganju ovu promenljivu.

Svaki put kada Jiki dođe do zatvorene vitičaste zagrade, baci kutiju sa `letter` i napravi novu sa sledećim slovom u njoj. Tako da će prvi put baciti `"J"` i umesto toga staviti `"e"` u kutiju. Zatim će uraditi isto za `"r"`, pa za `"e"`, pa za `"m"`, pa za `"y"`. Šest slova, šest krugova kroz petlju. Potrebno je malo vremena da se navikneš na sintaksu, ali sam koncept i nije toliko težak.

<img
  class="concept-image"
  src="/static/images/concept-assets/string-iteration/jiki-letter-box-loop.webp"
  alt="Jiki baca staru kutiju sa slovom i ubacuje sledeće slovo u novu kutiju označenu sa letter, ponavljajući za svako slovo u stringu"
  width="500"
  height="168"
/>
