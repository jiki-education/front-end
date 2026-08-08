---
title: "Else"
description: "Aggiungere una clausola `else` dopo un `if` per eseguire un blocco di codice diverso quando la condizione risulta falsa."
en_md5: 4dd08e94d86dd11cd54793cf64008e3d
---

Le istruzioni if ti permettono di controllare delle condizioni ed eseguire del codice solo quando qualcosa è vero. Adesso presentiamo il fedele complice di if: `else`.

Con un'istruzione if (_if statement_ in inglese), Jiki esegue il blocco di codice quando la condizione è vera, e lo salta quando è falsa. Ma cosa succede se vuoi che Jiki faccia una cosa quando la condizione è vera e una cosa diversa quando è falsa? È proprio a questo che serve else. Possiamo mettere una clausola else (_else clause_ in inglese) dopo la parentesi graffa di chiusura dell'if, e Jiki la eseguirà se la condizione dell'if è falsa. Tornando all'esempio del buttafuori, adesso abbiamo la possibilità di aprire la porta oppure di mandare via la persona, il che è probabilmente meglio che ignorarla del tutto come facevamo prima. Pensa a un bivio. Jiki arriva al bivio, controlla la condizione, e poi può andare da una parte se è vera o dall'altra se è falsa. Ma non va mai da entrambe le parti.

```javascript
if (age >= 21) {
  openDoor()
} else {
  turnAway()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/else/fork-in-the-road.webp"
  alt="Un bivio davanti alla porta del locale: apri la porta quando la condizione è vera, manda via la persona quando è falsa"
  width="500"
  height="332"
/>

E se le possibilità sono più di due? Immagina che il nostro buttafuori venda i biglietti. Sotto i tredici anni ricevi un biglietto bambini. Tra i tredici e i venti, un biglietto ragazzi. Da venti in su, un biglietto adulti. Quindi adesso ci sono tre esiti diversi. Per questo caso possiamo aggiungere un'altra istruzione if dopo l'else. In pratica diciamo: "Se questo, fai questo. Altrimenti, se quest'altro, fai quello. Altrimenti, fai quest'altra cosa." In questo esempio, Jiki vede l'if e controlla la prima condizione. Sedici è minore di tredici? No. Allora passa all'else if. Sedici è minore di venti? Sì, è vero. Quindi esegue quel blocco e consegna un biglietto ragazzi. E a quel punto ha finito. Non controlla nient'altro. Non guarda nemmeno l'else finale. Una volta che Jiki trova una condizione vera, esegue quel blocco e salta tutto quello che viene dopo.

```javascript
if (age < 13) {
  childTicket()
} else if (age < 20) {
  teenTicket()
} else {
  adultTicket()
}
```

Questo è il punto chiave da capire. Viene sempre eseguito un solo blocco. Jiki scende lungo la sequenza, trova la prima condizione vera, esegue quel blocco e va avanti.

Ora, c'è una cosa da capire davvero bene, perché qui in tanti si confondono. C'è una differenza sottile ma molto importante tra scrivere due istruzioni if separate e usare else if. Immagina di creare un programma che assegna un premio base o un premio bonus a seconda del punteggio di una persona. Guarda queste due possibilità. Una usa else if, l'altra usa due istruzioni `if` separate. Cosa cambierà nel comportamento?

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

Nel primo caso, con l'else if, controlliamo se il punteggio è alto e assegniamo il premio, e poi l'else if non viene eseguito. Quindi la persona, se ha un punteggio sopra i cento, riceve solo il premio bonus.

Nel secondo esempio, invece, i due if sono del tutto indipendenti. Vengono eseguiti entrambi ed entrambe le condizioni sono vere. Quindi qui la persona riceve due premi. Nel primo caso, un premio. Nel secondo, due premi. Prenditi un momento per essere sicuro di averlo capito davvero.

È interessante notare che entrambe le versioni potrebbero essere corrette, a seconda di come è pensato il gioco. Magari il concorrente riceve un premio normale più uno bonus, o magari passa direttamente al premio bonus. Nessuno dei due pezzi di codice è giusto o sbagliato. Sono semplicemente utili in situazioni diverse. Ma devi sapere quale dei due intendi usare.
