---
title: "Scope"
description: "Capire come le parentesi graffe creano un proprio insieme di scaffali, così che le variabili vivono solo finché il loro blocco esiste."
en_md5: 4d5fc2d1d304725660102e9aaceea4c3
---

Immagina un codice che disegna un cerchio in un punto diverso ogni volta che viene eseguito, e vogliamo disegnare 10 cerchi in punti diversi. Potremmo combinare questo con un ciclo. Ma per chi sta prestando molta attenzione, potresti aver notato qualcosa di strano qui.

```javascript
repeat(10) {
  let left = Math.randomInt(0, 100)
  let top = Math.randomInt(0, 100)
  circle(left, top, 5, "blue")
}
```

All'inizio, ho detto che c'era una regola: le scatole sugli scaffali di Jiki devono avere nomi unici,

e la parola chiave `let` crea una nuova scatola ogni volta che la usi.

Ma poiché `let` è in un ciclo, Jiki creerà una nuova scatola ogni volta che il ciclo viene eseguito.

Quindi il codice è sbagliato o sta succedendo qualcos'altro di strano?

<img
  class="concept-image"
  src="/static/images/concept-assets/scope/thinking-jiki.webp"
  alt="Jiki che sembra perplesso, chiedendosi se il codice sia sbagliato"
  width="384"
  height="400"
/>

Beh, si scopre che il codice è corretto. Questo è JavaScript perfettamente valido e funziona grazie a un concetto chiamato scope (_ambito di visibilità_) o scoping.

Lo scope è qualcosa che all'inizio probabilmente sembrerà abbastanza semplice, ma ti garantisco che ti darà problemi per il resto della tua carriera. Anche gli sviluppatori più esperti incontrano problemi con lo scope e JavaScript è uno dei linguaggi più complicati in questo senso. Te lo dico perché quando incontrerai problemi con lo scope, non ti sentirai male con te stesso. Ma soprattutto, presta molta attenzione a questa parte perché è importante.

Quando vedi una parentesi graffa nel codice, crea quello che si chiama un nuovo scope. Cosa significa? Beh, puoi immaginare che Jiki crei un nuovo piccolo insieme di scaffali nel suo laboratorio ogni volta che vede una parentesi graffa. E tutte le scatole che crea mentre lavora, eseguendo codice dentro quelle parentesi graffe, quelle scatole, quelle nuove scatole finiscono sul nuovo piccolo insieme di scaffali, non su quelli principali.

<img
  class="concept-image"
  src="/static/images/concept-assets/scope/shelves.webp"
  alt="Gli scaffali principali di Jiki accanto a un nuovo insieme più piccolo di scaffali creato da una parentesi graffa"
  width="500"
  height="205"
/>

E quando Jiki arriva alla corrispondente parentesi graffa di chiusura, butta via tutte le scatole che si trovano su questo insieme secondario di scaffali.

<img
  class="concept-image"
  src="/static/images/concept-assets/scope/shelves-loop-end.webp"
  alt="Jiki che butta le scatole dall'insieme secondario di scaffali in un cestino quando arriva alla parentesi graffa di chiusura"
  width="500"
  height="237"
/>

Quindi ogni volta che abbiamo un ciclo come questo, possiamo creare scatole che durano solo quanto ogni iterazione del ciclo. Le scatole `left` (sinistra) e `top` (superiore) che vedi qui, durano solo fino a quando raggiungiamo la parentesi graffa di chiusura, e poi vengono buttate via. E Jiki raggiunge quella parentesi graffa di chiusura ogni volta che il ciclo viene eseguito. Quindi sono 10 volte in questo programma. Quindi 10 volte creerà una scatola chiamata `left` e la butterà via di nuovo.

<img
  class="concept-image"
  src="/static/images/concept-assets/scope/left-top-boxes-color.webp"
  alt="Due scatole etichettate left e top che durano solo per un'iterazione del ciclo"
  width="500"
  height="187"
/>

Quindi quando crei una variabile, devi decidere per quanto tempo vuoi che rimanga in giro. Se vuoi che viva a lungo, deve stare fuori da qualsiasi parentesi graffa. Se vuoi che duri solo per una iterazione (_iteration_ in inglese), cioè una durata del ciclo, allora puoi metterla dentro le parentesi graffe. Vedi come tutto questo possa diventare un po' confuso? Quindi una buona regola per mantenere le cose semplici quando stai iniziando è tenere tutte le variabili vicino all'inizio del codice, fuori dalle parentesi graffe, e poi aggiornarle solo all'interno delle parentesi. Per esempio, potremmo scrivere il codice sopra con una sola scatola `left` e `top` impostate a zero all'inizio e poi aggiornate ogni volta all'interno del ciclo. Anche questo è perfettamente valido. Nessuna delle due è giusta o sbagliata. Ci sono delle buone pratiche, ma le impareremo più tardi. Per ora, sperimenta, divertiti, vedi cosa ti risulta più comodo e cerca di non preoccuparti troppo di questo.
