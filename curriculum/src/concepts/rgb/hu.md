---
title: "RGB színek"
description: "Piros, zöld és kék fény keverése 0-tól 255-ig, hogy bármilyen színt megjeleníthess a képernyőn."
en_md5: c879581c1a1edeeb448479749a3fd236
---

Az RGB segítségével a színekre úgy gondolhatunk, mint a piros, a zöld és a kék keverékére. Pontosan ezt jelenti az RGB rövidítés is: piros (_red (R)_ angolul), zöld (_green (G)_ angolul), kék (_blue (B)_ angolul). Ha emlékszel még az iskolai festékkeverésre, ez is hasonló, csak festék helyett fényt keverünk.

<img
  class="concept-image"
  src="/static/images/concept-assets/rgb/rgb-mixing-circles.webp"
  alt="Három egymást átfedő kör piros, zöld és kék fényből, amelyek keveredve sárgát, magentát, ciánt és fehéret adnak"
  width="500"
  height="390"
/>

Sok feladatban lesz egy `rgb(red, green, blue)` nevű függvényed, amely három számot vár bemenetként: egyet a piroshoz, egyet a zöldhöz, egyet a kékhez, és egy színt ad vissza.

A bemenetként használható számok nullától `255`-ig terjednek. A nulla azt jelenti, hogy abból a színből semennyit nem kérek, a `255` pedig azt, hogy amennyit csak lehet, keverjünk bele. Ha tehát az `rgb` függvényt a `255`, nulla, nulla bemenetekkel használjuk, azt mondjuk vele: kérem az összes pirosat. Ne feledd, a `255` a legnagyobb szám, amit ide beírhatsz. Zöldet és kéket viszont egyáltalán nem kérünk, ezért az a kettő nulla. Így pirosat kapunk, ezt a pirosat pedig eltárolhatjuk egy változóban, és utána ugyanúgy használhatjuk a `circle` függvényben, ahogy eddig a névvel megadott stringekkel tettük. Na és mi történik, ha az `rgb` függvényt a nulla, `255`, nulla bemenetekkel használjuk? Ekkor azt mondjuk: semmi piros, az összes zöld, semmi kék. Zöld kört kapunk tehát. És ha sárgát szeretnénk? A sárga a piros és a zöld keveréke. Mondhatjuk tehát azt: kérem az összes pirosat, az összes zöldet, kéket pedig egyáltalán nem, és így sárgát kapunk. Kisebb számokat is használhatunk. Ha némi pirosat kérünk, zöldet nem, kékből pedig sokat, lilát kapunk. Sok piros, egy kevés zöld és egy kicsivel több kék pedig rózsaszínt ad. Ez tehát az RGB: pirosat, zöldet és kéket keverünk, hogy különböző kombinációkat kapjunk.

```javascript
rgb(255, 0, 0)
```

<img
  class="concept-image"
  src="/static/images/concept-assets/rgb/rgb-red.webp"
  alt="Egy piros kör, amelyet az rgb(255, 0, 0) hoz létre: csupa piros, zöld és kék nélkül"
  width="436"
  height="400"
/>

```javascript
rgb(255, 255, 0)
```

<img
  class="concept-image"
  src="/static/images/concept-assets/rgb/rgb-yellow.webp"
  alt="Egy sárga kör, amelyet az rgb(255, 255, 0) hoz létre: csupa piros és csupa zöld, kék nélkül"
  width="436"
  height="400"
/>

```javascript
rgb(230, 50, 170)
```

<img
  class="concept-image"
  src="/static/images/concept-assets/rgb/rgb-pink.webp"
  alt="Egy rózsaszín kör, amelyet az rgb(230, 50, 170) hoz létre: sok piros, egy kevés zöld és némi kék"
  width="436"
  height="400"
/>

Az RGB akkor igazán hasznos, amikor egy adott összetevőt szeretnél külön állítani: hogy mennyi legyen a piros, mennyi a zöld és mennyi a kék.
