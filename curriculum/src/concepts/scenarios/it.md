---
title: "Scenari"
description: "Diverse condizioni iniziali che un esercizio usa per mettere alla prova il codice. Devi scrivere un programma che funzioni per tutte, non solo per la prima."
en_md5: d5c4ee54eed8083e13f18bb7d256b86d
---

Ogni esercizio presenta diversi scenari, diverse situazioni che il codice deve affrontare.

Li vedrai come piccoli pulsanti proprio sopra l'output di ogni esercizio. Ogni pulsante si riferisce a uno scenario diverso. Devi scrivere codice che funzioni per tutti, non solo per il primo. Lascia che lo ripeta. Scrivi il codice una volta sola, ma lo stesso codice viene eseguito per ogni scenario. La differenza è che ogni scenario può essere impostato in modo leggermente diverso, oppure le funzioni che ti vengono fornite possono restituire cose leggermente diverse a seconda dello scenario in cui ti trovi.

<img
  class="concept-image"
  src="/static/images/concept-assets/scenarios/scenario-buttons.webp"
  alt="La fila di pulsanti degli scenari proprio sopra l'output di un esercizio, cerchiati per evidenziarli"
  width="500"
  height="318"
/>

Prendi come esempio un gioco di golf. Potresti dover variare la distanza percorsa da una palla in base al valore restituito (_return value_ in inglese) di una funzione chiamata `getShotLength` (lunghezza del colpo), che ti dice quanto lontano ha colpito la palla il golfista. Immagina che il giocatore abbia dovuto fare uno swipe sul telefono per indicare la distanza del colpo.

<img
  class="concept-image"
  src="/static/images/concept-assets/scenarios/golf-game.webp"
  alt="Una scena di golf con un golfista, una palla e una bandierina nella buca a destra"
  width="412"
  height="400"
/>

Il risultato che ti arriva passa attraverso questa funzione. Quindi in uno scenario, puoi usare la funzione `getShotLength` e questa restituirà `23`, uno swipe breve. In un altro, restituisce `70`, uno swipe lungo. In un altro ancora, restituisce `45`. Il codice deve far rotolare la palla alla distanza giusta per ogni scenario, con un solo programma, un solo insieme di codice. Dovrai usare la funzione `getShotLength` per vedere quanto è andato lontano il colpo e poi far rotolare la palla fino a quel punto.

```javascript
let distance = getShotLength()
```

Gli scenari ti assicurano che il codice funzioni davvero correttamente. È piuttosto facile scrivere codice che funzioni in una situazione specifica. È molto più difficile e più prezioso scrivere codice che funzioni in tante situazioni diverse. Quando risolvi gli esercizi, inizia dal primo scenario. Fai in modo che funzioni. Poi passa allo scenario successivo e fai funzionare anche quello. Quando il codice si rompe in uno scenario diverso, pensa a cosa è cambiato e a come il codice deve adattarsi.
