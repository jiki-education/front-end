---
title: "Else if"
description: "Concatenare clausole `else if` per controllare più condizioni in ordine, eseguendo solo il primo blocco la cui condizione è vera."
en_md5: 5e1c9b2e77abbd41708f4c33b9aabd8f
---

Hai visto come `if` ed `else` ti danno due strade: fare una cosa quando una condizione è vera, farne un'altra quando è falsa. Ma cosa succede se le possibilità sono più di due?

Immagina che il nostro buttafuori venda i biglietti. Sotto i tredici anni ricevi un biglietto per bambini. Tra i tredici e i venti, un biglietto per ragazzi. A venti anni o più, un biglietto per adulti. Adesso quindi i risultati possibili sono tre. Per gestirli, possiamo aggiungere un'altra istruzione if dopo l'else. In pratica diciamo: "Se questa condizione è vera, fai questo. Altrimenti, se quest'altra è vera, fai quello. Altrimenti, fai quest'altra cosa ancora." In questo esempio Jiki vede l'if e controlla la prima condizione. Sedici è minore di tredici? No. Quindi passa all'else if. Sedici è minore di venti? Sì, è vero. Quindi esegue quel blocco e consegna un biglietto per ragazzi. E a quel punto ha finito. Non controlla nient'altro. Non guarda nemmeno l'else finale. Appena Jiki trova una condizione vera, esegue quel blocco e salta tutto quello che viene dopo.

```javascript
if (age < 13) {
  childTicket()
} else if (age < 20) {
  teenTicket()
} else {
  adultTicket()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/else-if/tickets.webp"
  alt="Tre biglietti con le etichette CHILD, TEEN e ADULT, uno per ogni risultato del controllo dell'età"
  width="500"
  height="142"
/>

Questo è il punto fondamentale da capire: viene sempre eseguito un solo blocco. Jiki scorre i controlli dall'alto verso il basso, trova la prima condizione vera, esegue quel blocco e va avanti.

Ora, c'è una cosa da capire davvero bene, perché è qui che in tanti si confondono. C'è una differenza sottile ma molto importante tra scrivere due istruzioni if separate e usare else if. Immagina di creare un programma che assegna un premio base o un premio bonus in base al punteggio di qualcuno. Guarda queste due possibilità: una usa else if, l'altra usa due istruzioni `if` separate. Cosa succederà di diverso?

```javascript
if (score > 100) {
  bonusPrize()
} else if (score > 50) {
  basicPrize()
}
```

```javascript
if (score > 100) {
  bonusPrize()
}
if (score > 50) {
  basicPrize()
}
```

Nel primo caso, con l'else if, controlliamo se il punteggio è alto e diamo il premio bonus, e a quel punto l'else if non viene eseguito. Quindi chi ha un punteggio sopra i cento riceve solo il premio bonus.

Nel secondo esempio, invece, i due if sono del tutto indipendenti. Verranno eseguiti entrambi, ed entrambe le condizioni saranno vere. Quindi qui la persona riceve due premi. Nel primo caso, un premio. Nel secondo, due premi. Prenditi un momento per essere sicuro di aver capito bene questo punto.

È interessante notare che entrambe le versioni potrebbero essere corrette, a seconda di come è pensato il gioco. Magari il concorrente riceve un premio normale più uno bonus, oppure viene semplicemente promosso al premio bonus. Nessuno dei due pezzi di codice è giusto o sbagliato: sono semplicemente utili in situazioni diverse. Ma devi sapere quale dei due intendi usare.
