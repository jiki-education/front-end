---
title: "Dodavanje ulaza funkcijama"
description: "Dodavanje ulaznih otvora sopstvenim funkcijama tako da mogu da rade različite stvari na osnovu prosleđenih vrednosti."
en_md5: f70d737888fcbda3306196ff069eb2f1
---

Funkcije koje si do sada napravio uvek rade potpuno istu stvar svaki put. `turnAround` (okreni se) uvek skreće levo dvaput. `shootIfAlienAbove` (pucaj ako je vanzemaljac iznad) uvek proverava i puca.

Ali razmisli o funkcijama koje si koristio tokom kursa, kako rade različite stvari u zavisnosti od ulaza. Rectangle prima left, top, width, height kao ulaze, a zatim crta različit pravougaonik na osnovu onoga što mu kažeš.

Sada ćemo dodati ulazne otvore i tvojim sopstvenim funkcijama.

Potrebno je da znaš dve stvari da bi ovo uradio. Prva je kako ovo zapravo izgleda, šta treba da napišeš, a druga je šta se zapravo dešava.

Prvi deo je prilično jednostavan. Samo dodaš obične zagrade i zatim imena ulaza koje želiš.

Zamisli da pravimo funkciju koja treba da puca više puta. Nazovimo je `shootMany` (pucaj više puta).

Napisali bismo je ovako:

```javascript
function shootMany(numShots) {
  // ...
}
```

Kada želiš da koristiš ovu funkciju, pozvao bi je sa brojem hitaca koji želiš:

```javascript
shootMany(5)
shootMany(2)
```

Ovo je ključni deo. Kada se kod izvrši, šta god staviš u taj ulaz, `5` ili `2`, mini-Jiki, sa šeširom unutar funkcije, uzima taj ulaz i stavlja ga u kutiju pod imenom `numShots` (broj hitaca), a zatim tu kutiju stavlja na police unutar funkcije, kako bi mogao da je koristiš u kodu te funkcije.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-inputs/numshots-box.webp"
  alt="Mini-Jiki unutar mašine `shootMany` stavlja ulaz u kutiju sa natpisom `numShots`"
  width="500"
  height="376"
/>

Ponoviću to.

Kada napišemo `shootMany(5)` da bismo koristili funkciju, Jiki sa spoljašnje strane ode i donese `5` i stavi ga u ulazni otvor `shootMany`-ja. Unutar mašine, mini-Jiki uzima taj `5` i stavlja ga u kutiju pod imenom `numShots`, jer si ti tom ulaznom otvoru dao to ime, a zatim tu kutiju stavlja na police unutar funkcije u mašini.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-inputs/numshots-on-shelf.webp"
  alt="Mini-Jiki stavlja kutiju `numShots` na police unutar mašine `shootMany`"
  width="500"
  height="302"
/>

I zatim, unutar funkcije, možeš da koristiš kutiju `numShots` baš kao i bilo koju drugu kutiju. U imenu `numShots` nema ničeg magičnog. Mogli smo da je nazovemo kako god želimo. To je samo instrukcija za mini-Jikija da uvek napravi kutiju sa tom oznakom unutar funkcije i da u nju stavi ono što je prosleđeno kroz taj otvor.

A kada imaš vrednost u toj kutiji, možeš da radiš sve što inače radiš sa kutijama. Mogao bi da iskoristiš kutiju `numShots` kao deo `repeat` petlje da bi pucao tačan broj puta. A možeš imati i više od jednog ulaza. Samo ih razdvoji zarezima.

Dakle, ako imamo funkciju pod imenom `drawStar` (nacrtaj zvezdu) koja crta zvezdu na osnovu pozicije gornjeg-levog ugla, napisali bismo je ovako:

```javascript
function drawStar(left, top) {
  // ...
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-inputs/draw-star-two-slots.webp"
  alt="Mašina `drawStar` sa dva ulazna otvora, koja prima dve odvojene vrednosti"
  width="453"
  height="400"
/>

A kada se funkcija pozove, mini-Jiki će jednostavno smestiti vrednosti prosleđene u ulaze u kutije pod imenima `left` (levo) i `top` (gore), a zatim ih odložiti na police unutar funkcija.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-inputs/draw-star-boxes-shelf.webp"
  alt="Mini-Jiki smešta dva ulaza u kutije sa natpisima `left` i `top` na police unutar mašine `drawStar`"
  width="431"
  height="400"
/>
