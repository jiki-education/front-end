---
title: "Funzioni che restituiscono qualcosa"
description: "Prendere un valore che esce dallo scivolo di output di una funzione e usarlo nel tuo codice."
en_md5: 5d8a17a37be570bc9c63df0c854ba774
---

Finora abbiamo visto funzioni che fanno qualcosa nel mondo. Quindi la funzione `circle` disegna un cerchio. La funzione `move` sposta il tuo personaggio. Ma alcune funzioni funzionano in modo diverso. Invece di fare qualcosa di esterno, ti danno indietro qualcosa che puoi usare all'interno del tuo codice. Quando una funzione fornisce qualcosa a Jiki da usare nel codice, diciamo che questa funzione restituisce (_return_ in inglese) qualcosa. Restituisce qualcosa indietro a Jiki. Puoi pensare a queste macchine come se avessero uno scivolo di output. Abbiamo già le nostre fessure di input in cui mettiamo le cose, ma possiamo anche avere una singola fessura di output o uno scivolo da cui qualcosa può tornare fuori. Quando Jiki preme il pulsante sulla macchina, la macchina si mette in moto e qualcosa salterà fuori da quello scivolo alla fine. Potrebbe essere un numero. Potrebbe essere una stringa. È qualcosa che Jiki può prendere e usare.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-return-values/machine-with-return-chute.webp"
  alt="Una macchina con uno scivolo di output sul fianco, pronta a inviare un valore indietro a Jiki"
  width="500"
  height="317"
/>

La maggior parte delle funzioni, probabilmente il 95%, restituisce qualcosa. Potrebbero fare dei calcoli per te e restituire il valore, oppure potrebbero unire alcune stringhe e poi darti la stringa risultante. O forse ti restituiscono l'ora corrente ogni volta che esegui quella macchina. Vediamo quest'ultimo caso. Diciamo che abbiamo una funzione chiamata `getCurrentTime` (ottieni l'ora corrente). Ogni volta che Jiki esegue la macchina, un foglio di carta scivola fuori dallo scivolo di output con l'ora scritta sopra, ad esempio 14:35.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-return-values/paper-out-of-chute.webp"
  alt="La macchina getCurrentTime con un foglio di carta che riporta 14:35 che scivola fuori dallo scivolo di output"
  width="500"
  height="312"
/>

E poi possiamo mettere quel valore restituito in una scatola usando `let`:

```javascript
let time = getCurrentTime()
```

Jiki eseguirà la macchina, prenderà l'ora corrente dallo scivolo e la conserverà in una scatola chiamata `time`.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-return-values/jiki-boxing-time.webp"
  alt="Jiki mette il foglio con 14:35 prelevato dallo scivolo in una scatola etichettata time"
  width="372"
  height="400"
/>

Ora, è importante capire che il foglio di carta che Jiki mette nella scatola è fissato in quel momento. Anche se l'orario reale cambia mentre il tuo programma è in esecuzione, la scatola contiene ancora quel foglio con scritto 14:35. Una volta che qualcosa è nella scatola, è una cosa fissa lì dentro. Non cambia magicamente. Se in futuro vogliamo rimettere l'ora corrente nella scatola, dobbiamo usare di nuovo la nostra funzione `getCurrentTime` per ottenerla.

La maggior parte delle funzioni che restituiscono qualcosa ha anche degli input. Per esempio, potremmo avere una funzione `join` (unire) che prende due stringhe come input e le restituisce unite con uno spazio. Quindi, se usiamo una macchina `join` con `"Hello"` e `"World"` come input, dallo scivolo uscirà un'unica stringa con scritto `"Hello World"`.

```javascript
join("Hello", "World"); // "Hello World"
```
