---
title: "Aggiungere input alle funzioni"
description: "Aggiungere fessure di input alle tue funzioni, così possono fare cose diverse in base ai valori passati."
en_md5: f70d737888fcbda3306196ff069eb2f1
---

Le funzioni che hai creato finora fanno sempre esattamente la stessa cosa ogni volta. `turnAround` (girati) fa sempre girare a sinistra due volte. `shootIfAlienAbove` (spara se l'alieno è sopra) controlla e spara sempre.

Ma pensa alle funzioni che hai usato durante il corso, a come fanno cose diverse a seconda degli input. `Rectangle` prende left, top, width e height come input, e poi disegna un rettangolo diverso in base a ciò che gli dici.

Ora aggiungeremo anche alle tue funzioni le fessure di input.

Per farlo, devi sapere due cose. La prima è come appare, cosa devi scrivere, e la seconda è cosa succede davvero.

La prima parte è piuttosto semplice. Devi solo aggiungere delle normali parentesi tonde (`()`) e poi i nomi degli input che vuoi.

Immagina di creare una funzione che deve sparare molte volte. Chiamiamola `shootMany` (spara più volte).

La scriveremmo così:

```javascript
function shootMany(numShots) {
  // ...
}
```

Quando vuoi usare questa funzione, la chiameresti con il numero di spari che vuoi:

```javascript
shootMany(5)
shootMany(2)
```

Ora arriva il punto chiave. Quando il codice viene eseguito, qualsiasi cosa tu abbia messo in quell'input, `5` o `2`, mini-Jiki, con il cappello all'interno della funzione, prende quel valore in input e lo mette in una scatola chiamata `numShots` (numero di spari), e poi mette quella scatola sugli scaffali all'interno della funzione, perché tu possa usarla nel codice della funzione.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-inputs/numshots-box.webp"
  alt="Mini-Jiki all'interno della macchina shootMany che inserisce l'input in una scatola etichettata numShots"
  width="500"
  height="376"
/>

Lo ripeto.

Quando scriviamo `shootMany(5)` per usare la funzione, Jiki, all'esterno, va a prendere un `5` e lo mette nella fessura di input di `shootMany`. Dentro la macchina, mini-Jiki tira fuori quel `5` e lo mette in una scatola chiamata `numShots`, perché è il nome che hai dato a quella fessura di input, e poi mette quella scatola sugli scaffali, dentro la funzione, dentro la macchina.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-inputs/numshots-on-shelf.webp"
  alt="Mini-Jiki che mette la scatola numShots sugli scaffali all'interno della macchina shootMany"
  width="500"
  height="302"
/>

E poi, all'interno della funzione, puoi usare la scatola `numShots` come useresti qualsiasi altra scatola. Non c'è niente di magico nel nome `numShots`. Avremmo potuto chiamarla come volevamo. È solo un'istruzione per mini-Jiki di creare sempre, all'interno della funzione, una scatola con quell'etichetta e di metterci dentro tutto ciò che viene passato in quella fessura.

E una volta che hai un valore in quella scatola, puoi fare tutto quello che faresti normalmente con le scatole. Potresti usare la scatola `numShots` in un ciclo `repeat` per sparare il numero corretto di volte. E puoi avere anche più di un input. Basta separarli con delle virgole. Quindi, se abbiamo una funzione chiamata `drawStar` (disegna stella) che disegna una stella in base alla sua posizione in alto a sinistra, la scriveresti così:

```javascript
function drawStar(left, top) {
  // ...
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-inputs/draw-star-two-slots.webp"
  alt="La macchina drawStar con due fessure di input, che riceve due valori separati"
  width="453"
  height="400"
/>

E poi, quando la funzione viene chiamata, mini-Jiki memorizza i valori passati agli input in scatole chiamate `left` (sinistra) e `top` (alto), e poi le mette sugli scaffali all'interno della funzione.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-inputs/draw-star-boxes-shelf.webp"
  alt="Mini-Jiki che memorizza i due input in scatole etichettate left e top sugli scaffali all'interno della macchina drawStar"
  width="431"
  height="400"
/>
