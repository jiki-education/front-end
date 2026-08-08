---
title: "Usare più funzioni insieme"
description: "Suddividere un problema in piccole funzioni con singola responsabilità che si chiamano a vicenda, in modo che ogni pezzo rimanga semplice e riutilizzabile."
en_md5: 7df3110b30c0f279d7f04d3b4e331a99
---

Finora, quando hai scritto delle funzioni, ognuna se l'è cavata da sola e conteneva tutta la logica necessaria per funzionare.

Adesso vedremo come suddividere le funzioni in pezzi più piccoli che lavorano insieme, invece di avere funzioni grandi che fanno tante cose insieme.

Come regola generale in programmazione, vuoi che ogni funzione faccia il minimo indispensabile. Diciamo che una funzione ha una singola responsabilità (_single responsibility_ in inglese). Ogni funzione dovrebbe fare solo una cosa e usare altre funzioni per le diverse sotto-parti che la compongono.

Vediamo un esempio.

Immagina di avere una funzione il cui compito è restituire una stringa che descrive un nome.

Una versione semplice apparirebbe così. Abbiamo un ciclo di conteggio, qualcosa che hai già scritto, e poi una stringa interpolata che mette insieme il risultato.

```javascript
function describeName(name) {
  let length = 0
  for (const letter in name) {
    length += 1
  }
  return `This name is ${length} letters long`
}
```

Funziona bene, ma sta facendo due cose. Fa una cosa abbastanza generica, contare, e un'altra cosa molto specifica, costruire questa stringa in un formato particolare.

Sarebbe molto meglio suddividerla in due funzioni: una responsabile del conteggio e una responsabile di descrivere un nome in questo formato specifico.

```javascript
// Just counts letters
function countLetters(str) {
  let count = 0
  for (const letter in str) {
    count += 1
  }
  return count
}

// Just formats text nicely
function describeName(name) {
  const count = countLetters(name)
  return `The name has ${count} letters`
}
```

E poi possiamo riutilizzare quella funzione di conteggio generica in questa formattazione di stringhe, ma anche in qualsiasi altro posto in cui ti serve. Ogni volta che dobbiamo contare le lettere in una stringa, è completamente separata da tutto ciò che riguarda la stampa.

Puoi leggere entrambe le funzioni isolatamente e capire subito cosa fanno.

Man mano che le tue funzioni diventano più complesse e ne hai di più, questa tecnica fa la differenza tra avere codice pulito e leggibile e la confusione totale e il disordine.

C'è una cosa che vale la pena ricordare ancora: tutto ciò che crei all'interno di una funzione non può essere usato da altre funzioni a meno che tu non lo restituisca esplicitamente.

Quindi se provi a fare riferimento alla variabile `count` (contatore) dall'interno di `describeName` (descrivi nome), non puoi farlo, perché appartiene all'altra funzione.

<img
  class="concept-image"
  src="/static/images/concept-assets/function-composition/jiki-thinking.webp"
  alt="Jiki che pensa, con una lampadina sopra la testa, a come le variabili rimangono private per ogni funzione"
  width="361"
  height="353"
/>

In JavaScript possiamo creare variabili in cima, sopra ogni altra cosa, condivise tra le funzioni, ma ti consiglio di non farlo a meno che non ci sia una buona ragione.

Più mantieni ogni funzione indipendente, e la parola tecnica per questo è pura, funzioni pure, più il tuo codice sarà pulito e meno bug creerai ed avrai.
