---
title: "Colori RGB"
description: "Mescolare luce rossa, verde e blu con valori da 0 a 255 per creare qualsiasi colore sullo schermo."
en_md5: 8ed038f6d17072b6fb6eaae6bef15c2c
---

RGB ci permette di pensare ai colori come a una combinazione di rosso, verde e blu. Ecco cosa significa RGB: rosso (_red (R)_ in inglese), verde (_green (G)_ in inglese), blu (_blue (B)_ in inglese). Se ricordi di aver mescolato i colori a scuola, l'idea è simile, solo che invece della tempera mescoliamo luce.

<img
  class="concept-image"
  src="/static/images/concept-assets/rgb/rgb-mixing-circles.webp"
  alt="Tre cerchi sovrapposti di luce rossa, verde e blu che si mescolano per creare giallo, magenta, ciano e bianco"
  width="500"
  height="390"
/>

In molti esercizi avrai a disposizione una funzione chiamata `rgb(red, green, blue)`, che prende tre numeri come input, uno per il rosso, uno per il verde, uno per il blu, e restituisce un colore.

I numeri che puoi usare come input vanno da zero a `255`. Zero significa che non vuoi nessuna quantità di quel colore, e `255` significa che vuoi mescolare la massima quantità possibile di quel colore. Quindi, se usiamo la funzione `rgb` con `255`, zero e zero come input, stiamo dicendo che vuoi tutto il rosso. Ricorda che `255` è il numero più grande che puoi inserire lì. Ma non vogliamo né verde né blu, quindi sono entrambi zero. Quindi otteniamo il rosso, e possiamo memorizzare quel rosso in una variabile e poi usarlo nella funzione `circle`, proprio come abbiamo già fatto con le stringhe con nome. E se usiamo la funzione `rgb` con zero, `255`, zero? Stiamo dicendo niente rosso, tutto il verde, niente blu. Quindi otteniamo un cerchio verde. E se vuoi il giallo? Il giallo è una combinazione di rosso e verde. Quindi possiamo dire: dammi tutto il rosso, tutto il verde e niente blu, e questo ci darà il giallo. E possiamo usare numeri più piccoli. Quindi, se vogliamo un po' di rosso, niente verde e tanto blu, otteniamo il viola. Tanto rosso, un po' di verde, un po' più di blu, otteniamo un rosa. Ed ecco RGB: mescoliamo rosso, verde e blu per ottenere diverse combinazioni.

```javascript
rgb(255, 0, 0) // rosso
```

<img
  class="concept-image"
  src="/static/images/concept-assets/rgb/rgb-red.webp"
  alt="Un cerchio rosso prodotto da rgb(255, 0, 0), tutto rosso e niente verde o blu"
  width="436"
  height="400"
/>

```javascript
rgb(255, 255, 0) // giallo
```

<img
  class="concept-image"
  src="/static/images/concept-assets/rgb/rgb-yellow.webp"
  alt="Un cerchio giallo prodotto da rgb(255, 255, 0), tutto rosso e tutto verde, niente blu"
  width="436"
  height="400"
/>

```javascript
rgb(230, 50, 170) // rosa
```

<img
  class="concept-image"
  src="/static/images/concept-assets/rgb/rgb-pink.webp"
  alt="Un cerchio rosa prodotto da rgb(230, 50, 170), tanto rosso, un po' di verde e un po' di blu"
  width="436"
  height="400"
/>

RGB è ottimo quando vuoi regolare una componente specifica: quanto rosso, quanto verde, quanto blu.
