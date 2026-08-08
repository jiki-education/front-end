---
title: "Dodavanje povratnih vrednosti funkcijama"
description: "Korišćenje ključne reči `return` kako bi tvoje funkcije dobile izlazni otvor koji vraća vrednost onome ko ih pozove."
en_md5: 51d31f709a7051c29b499a31ad68555e
---

Sada znaš kako se prave funkcije sa ulazima i bez njih. Ostala je još jedna stvar da naučiš, i posle toga ćeš biti ekspert za pravljenje funkcija – a to je kako da svojim funkcijama daš izlazni otvor.

Već koristiš mnogo funkcija koje vraćaju vrednosti. `isAlienAbove` (proverava da li je vanzemaljac iznad) ti vraća tačno ili netačno. `Math.randomInt(1, 10)` (vraća nasumični ceo broj između 1 i 10) ti vraća nasumičan broj.

Kada Jiki koristi te funkcije, nešto iskače iz izlaznog otvora, što on zatim može da iskoristi.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-return-values/output-chute.webp"
  alt="Jiki skuplja vrednost dok iskače iz izlaznog otvora mašine"
  width="500"
  height="312"
/>

Da bismo to uradili, potrebna nam je još jedna nova ključna reč, a to je `return`.

Ključna reč `return` govori Malom Jikiju da gurne nešto kroz izlazni otvor.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-return-values/return-keyword-push.webp"
  alt="Mali Jiki unutar mašine gura vrednost 42 kroz izlazni otvor"
  width="500"
  height="335"
/>

Hajde da napravimo funkciju i nazovimo je `meaningOfLife` (značenje života). Posao ove funkcije je uvek samo da vrati broj `42`. Nema ulaza. Pišemo je ovako:

```javascript
function meaningOfLife() {
  return 42
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-return-values/meaning-of-life-42.webp"
  alt="Mašina meaningOfLife šalje broj 42 kroz svoj izlazni otvor"
  width="500"
  height="323"
/>

Sada, gde god u kodu koristimo `meaningOfLife()`, dobijamo broj `42` nazad, koji možemo da koristimo kao i bilo koju drugu vrednost. Možemo ga staviti u kutiju pomoću `let`, možemo ga proslediti kao ulaz drugoj funkciji, možemo ga uporediti u `if` naredbi.

Funkcije koje vraćaju vrednosti takođe mogu primati ulaze. Mogao bi da napišeš funkciju `ageBracket(age)` (starosna kategorija) koja vraća `"Sorry, too young"` kada je `age` ispod 18, a `"Welcome"` inače. Ko god je pozove, dobija onaj `string` koji funkcija vrati.

```javascript
function ageBracket(age) {
  if (age >= 18) {
    return "Welcome"
  }
  return "Sorry, too young"
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-return-values/age-input.webp"
  alt="Vrednost starosti se ubacuje u ulazni otvor mašine kako bi ona odlučila šta da vrati"
  width="487"
  height="400"
/>

Ovako programiranje funkcioniše u svojoj suštini. Kreiramo mnogo ovakvih malih gradivnih blokova i onda ih sastavljamo u programe.
