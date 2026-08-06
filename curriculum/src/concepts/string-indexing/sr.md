---
title: "Indeksiranje stringova"
description: "Korišćenje uglastih zagrada i broja pozicije da izvučeš jedno slovo iz stringa. Zapamti da pozicije počinju od nule."
en_md5: cd31e0366b3090b358494667003f54c9
---

Zamisli da imaš moje ime, Jeremy, i da želiš da iz njega izvučeš moj inicijal J. Kako bismo to uradili?

<img
  class="concept-image"
  src="/static/images/concept-assets/string-indexing/jiki-thinking.webp"
  alt="Jiki razmišlja kako da izvuče jedno slovo iz stringa"
  width="361"
  height="353"
/>

Pa, možeš da zamisliš string kao niz slova. Dakle, `"Jeremy"` ima šest slova, J-E-R-E-M-Y, i svako od njih ima svoju poziciju. `"J"` je na prvoj poziciji, `"y"` je na poslednjoj poziciji.

U JavaScriptu i većini programskih jezika, ove pozicije počinju od nule. Tako da je prvo slovo `"J"` na poziciji nula, zatim imamo `"e"` na poziciji jedan, `"r"` na dva, `"e"` na tri, `"m"` na četiri i `"y"` na pet.

Ovo brojanje od nule je prilično čudno, i iskreno, život bi bio lakši kada bismo jednostavno brojali od jedan, kao u normalnom svetu. Ali ne brojimo. U većini programskih jezika počinjemo da brojimo od nule, tako da to jednostavno moraš da naučiš.

Dakle, ako želimo da dobijemo slovo na određenoj poziciji, možemo da koristimo uglaste zagrade sa brojem unutra.

Dakle, ako napišemo `"Jeremy"[0]`, kažemo: daj mi prvo slovo reči `"Jeremy"`.

Ako napišemo `"Jeremy"[1]`, kažemo: daj mi drugo slovo.

```javascript
"Jeremy"[0] // "J"
"Jeremy"[1] // "e"
```

A to možemo da uradimo i sa promenljivama. Dakle, ako napravimo promenljivu pod imenom `name` (ime) i postavimo njenu vrednost na string `"Jeremy"`, onda možemo da napišemo `name[0]` i ponovo ćemo dobiti `"J"`.

```javascript
let name = "Jeremy"
name[0] // "J"
```

Da razjasnimo jednu stvar: ono što dobiješ iz `name[0]` je samo još jedan string. To je još jedan komad papira na kom piše J. U tome nema ničeg posebnog. To je string, baš kao što je i `"Jeremy"` string.

<img
  class="concept-image"
  src="/static/images/concept-assets/string-indexing/jiki-holding-j.webp"
  alt="Jiki drži novi komad papira na kome je samo slovo J"
  width="500"
  height="289"
/>

Samo se dešava da na njemu stoji jedno slovo umesto šest.

I to ne utiče na originalni string. Mi ne kidamo J, ili tako nešto. Samo nalazimo koje slovo želimo, a zatim pravimo novi string sa tim slovom.
