---
title: "Aritmetica"
description: "Combinare le variabili con la matematica, facendo sì che i valori si relazionino e dipendano tra loro tramite addizione, sottrazione, moltiplicazione e divisione."
en_md5: 7ce54754a3ca29896609a01a51b12377
---

Finora, quando abbiamo creato variabili, abbiamo usato solo valori semplici: un numero come `50` o una stringa come `"yellow"`. Le variabili diventano molto più potenti quando possiamo usarle in combinazione tra loro. Così possiamo dire che il bordo sinistro del rettangolo deve trovarsi a una certa distanza dal bordo dell'area di disegno.

Nella programmazione, possiamo usare la matematica di base, le solite operazioni come addizione, sottrazione, moltiplicazione e divisione, e possiamo usare le variabili che abbiamo già impostato come parte di queste.

Iniziamo dicendo che vogliamo disegnare un rettangolo sulla nostra area di disegno, e vogliamo che inizi a 10 di distanza dal bordo sinistro e dal bordo destro, e a 20 dal bordo superiore e dal bordo inferiore. Quindi sarà al centro dell'area di disegno, leggermente più largo che alto.

<img
  class="concept-image"
  src="/static/images/concept-assets/arithmetic/rectangle-on-canvas.webp"
  alt="Un rettangolo blu centrato sull'area di disegno, a 10 di distanza da sinistra e da destra e a 20 dall'alto e dal basso"
  width="399"
  height="400"
/>

Quando disegniamo un rettangolo, abbiamo bisogno di conoscerne il `left` (sinistra), il `top` (alto), la `width` (larghezza) e la `height` (altezza), oltre al suo colore. Quindi possiamo iniziare scrivendo tutto questo.

E ora dobbiamo effettivamente calcolare quali dovrebbero essere il suo `left`, il suo `top`, la sua `width` e la sua `height`. Quindi impostiamoli. `left` è 10. `top` è 20. La `width`, beh, la `width` è la dimensione dell'area di disegno, che è 100, meno il 10 a sinistra e il 10 a destra, quindi fa 80. E la `height` è l'altezza dell'area di disegno, che è sempre 100, meno il 20 in alto e il 20 in basso, quindi 60.

```javascript
let left = 10
let top = 20
let width = 80
let height = 60

rectangle(left, top, width, height, "blue")
```

Quindi possiamo impostare quelle variabili. `left`, 10, `top`, 20, `width`, 80, `height`, 60. Ma cosa succede se invece vogliamo spostare il rettangolo un po' più all'interno, renderlo un po' più piccolo? Se vogliamo spostarlo a 20 dal bordo sinistro e destro e a 30 dall'alto e dal basso? Dobbiamo rifare tutti i calcoli. La `width` ora è 100 meno 20 meno 20, e la `height` è 100 meno 30 meno 30, e questo è decisamente più lavoro e più matematica di quanto io voglia fare. Quindi, invece, possiamo dire al computer di farlo per noi.

Possiamo impostare la `width` come 100 meno il `left` meno il `left`, e la `height` come 100 meno il `top` meno il `top`, perché il margine superiore e inferiore sono uguali. Oppure possiamo scriverlo come 100 meno `left` per due, o 100 meno `top` per due.

```javascript
let width = 100 - left * 2
let height = 100 - top * 2
```

E ora, se cambiamo il `left` o il `top`, anche la `width` e la `height` cambieranno. Quindi le cose iniziano a collegarsi tra loro. E per quanto riguarda l'area di disegno? Al momento è 100. Ma cosa succede se la nostra area di disegno diventa 200 di larghezza e di altezza, invece? Beh, probabilmente dovremmo impostare una variabile chiamata `canvasSize` (dimensione dell'area di disegno) e impostarla a 100. E ora la nostra `width` è `canvasSize` meno `left` per due, e la nostra `height` è `canvasSize` meno `top` per due.

```javascript
let canvasSize = 100
let left = 20
let top = 30
let width = canvasSize - left * 2 // 60
let height = canvasSize - top * 2 // 40

rectangle(left, top, width, height, "blue")
```

Pensiamo a quello che fa Jiki quando scriviamo let `height` uguale `canvasSize` meno `top` per due. Beh, inizia prendendo la scatola `top` dallo scaffale, ci trova dentro 30, tira fuori la sua calcolatrice tascabile e fa 30 per due, e si fa un appunto mentale di 60.

<img
  class="concept-image"
  src="/static/images/concept-assets/arithmetic/flow-of-images-1.webp"
  alt="Jiki prende la scatola top dallo scaffale e calcola 30 per due fa 60"
  width="377"
  height="400"
/>

E poi prende la scatola `canvasSize` dallo scaffale, ci trova dentro 100, e calcola che 100 meno 60 fa 40. E ora sa che in realtà quello che stiamo dicendo è let `height` uguale 40. Quindi obbedisce al let, prende una nuova scatola, ci scrive sopra `height`, e poi ci mette dentro 40. E più tardi, quando usa `height`, tira fuori di nuovo il 40.

<img
  class="concept-image"
  src="/static/images/concept-assets/arithmetic/flow-of-images-3.webp"
  alt="Jiki prende una nuova scatola, scrive height sopra e ci mette dentro 40"
  width="462"
  height="400"
/>

Una volta che hai tutto funzionante in un esercizio, divertiti a cambiare i valori delle variabili e vedi cosa succede. Osserva come crescono e come si riducono. Prenditi il tuo tempo, rifletti sulle relazioni tra le cose.
