---
title: "Aggiornare le variabili"
description: "Modificare il contenuto di una variabile durante l'esecuzione del programma per tenere traccia di posizioni, conteggi, punteggi e altri valori che cambiano."
en_md5: f9b2fbb6bfd82a620b093e88951ff841
---

Finora, quando abbiamo creato delle variabili, abbiamo messo dei valori nelle scatole e poi li abbiamo ripresi più tardi. È stato molto utile per dare chiarezza al nostro codice e per ridurre un po' di calcoli mentali che altrimenti avremmo dovuto fare. Ma il vero valore delle variabili viene dalla possibilità di cambiare ciò che c'è dentro una scatola, ciò che c'è dentro la variabile, nel corso del programma. Così, anche se eseguiamo lo stesso pezzo di codice più volte, quello che fa può cambiare a seconda di cosa c'è dentro le scatole.

Supponiamo di voler piantare un fiore in un giardino. Abbiamo una comoda funzione `plant` (pianta) che ha un solo input per la posizione in cui vogliamo mettere il fiore. Quindi, se vogliamo posizionare un fiore a 10 dal bordo, lo scriviamo così:

```javascript
plant(10)
```

<img
  class="concept-image"
  src="/static/images/concept-assets/updating-variables/flowers-same-spot.webp"
  alt="Un fiore piantato in un giardino accanto alla lavagna di Jiki"
  width="406"
  height="400"
/>

E se volessimo piantare otto fiori? Beh, potremmo scrivere `plant(10)`, `plant(20)`, `plant(30)` e così via, ma è piuttosto noioso.

E abbiamo già imparato qualcosa che ci aiuta a sostituire questo tipo di codice noioso. Usa un ciclo! Usa un blocco `repeat`! Quindi impostiamo la posizione a 10, e poi abbiamo un blocco `repeat` in cui chiamiamo `plant`, usiamo la funzione `plant`, otto volte.

```javascript
let position = 10
repeat(8) {
  plant(position)
}
```

Cosa pensi che succederà?

Beh, pianterà otto fiori, ma li pianterà nello stesso punto ogni volta, che non è proprio ciò che vogliamo. Quindi prendiamoci un attimo per pensare a cosa sta facendo Jiki. Sta creando una scatola con l'etichetta `position`. Ci mette dentro 10. Poi esegue la macchina `plant` otto volte. Ogni volta, tira fuori il valore dalla scatola `position`. È sempre 10, e inserisce sempre quel 10.

<img
  class="concept-image"
  src="/static/images/concept-assets/updating-variables/jiki-loop-walkthrough.webp"
  alt="Jiki che prende la scatola `position` dallo scaffale e inserisce il suo valore, 10, nella macchina `plant`"
  width="400"
  height="400"
/>

Quindi ciò di cui abbiamo bisogno è un modo per avanzare un po'. Dopo aver piantato un fiore, vogliamo dire a Jiki di spostare la posizione avanti di 10, pronti per piantare il prossimo fiore.

Allora, dimenticando il codice per un attimo, come appare logicamente farlo? Se ti dico: «Pianta il primo fiore a 10, poi il prossimo a 20, poi il prossimo a 30», come fa il tuo cervello a sapere che il prossimo dovrebbe essere piantato a 40 e quello dopo a 50?

Quello che sta facendo il tuo cervello è tenere traccia del numero attuale e aggiungere 10, e poi aggiornare quel numero nella tua testa.

E possiamo fare esattamente la stessa cosa nel codice. Per farlo, diciamo: «Aggiorna la scatola `position` in modo che contenga il valore attuale della posizione più 10».

Quando Jiki vede questa istruzione, prende il numero attuale dalla scatola `position`, aggiunge 10, fa il calcolo, li somma, e poi rimette il risultato nella scatola per la prossima volta.

```javascript
position = position + 10
```

<img
  class="concept-image"
  src="/static/images/concept-assets/updating-variables/jiki-updating-box.webp"
  alt="Jiki che prende 10 dalla scatola `position`, aggiunge 10 per ottenere 20, e rimette 20 nella scatola"
  width="427"
  height="400"
/>

Quindi se aggiungiamo questa istruzione al nostro programma, in modo da dire: «Imposta il valore iniziale di `position` a 10», poi per otto volte piantiamo un fiore alla posizione, e poi cambiamo la posizione in modo che sia 10 più grande di prima, il nostro codice funziona, e otteniamo otto fiori distanziati.

Nota che quando aggiorniamo la variabile non c'è `let`. Questo è molto importante. Quando Jiki vede `let`, crea una nuova scatola. Ma qui non vogliamo creare una nuova scatola. Vogliamo cambiare ciò che c'è nella scatola che abbiamo già.

Nota anche che creiamo la scatola una sola volta, fuori dal ciclo. È importante da ricordare. Crea la scatola una volta all'inizio, e poi aggiornala ogni volta che il ciclo viene eseguito.

Possiamo aggiornare ciò che c'è nelle scatole, e possiamo usare questa capacità per tenere traccia di qualcosa che cambia nel tempo. Userai questo schema costantemente, per tracciare una posizione, contare quante volte è successo qualcosa, tenere il punteggio. Ogni volta che hai bisogno di ricordare qualcosa che cambia mentre il tuo programma è in esecuzione, è così che si fa.
