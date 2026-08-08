---
title: "Le istruzioni if"
description: "Usare la parola chiave `if` per eseguire un blocco di codice solo quando una condizione è vera, come un buttafuori che decide chi far entrare."
en_md5: 8797e078e1ad90b7652373baf6f96f28
---

C'è una parola chiave che ci aiuta a dire a Jiki di fare qualcosa solo in certe situazioni. Magari stai scrivendo del codice per sorvegliare l'ingresso di un bar, magari sei un buttafuori, e Jiki deve aprire la porta solo se una persona è vestita in modo adeguato. O magari stai scrivendo del codice in cui tocca a te sventolare la bandiera a scacchi alla fine di una gara, ma Jiki deve sapere che va sventolata solo all'ultimo giro. In situazioni come queste useremo la parola chiave `if`.

<img
  class="concept-image"
  src="/static/images/concept-assets/if/bar-door-scenario.webp"
  alt="Jiki nei panni di un buttafuori che decide chi far entrare nel locale notturno"
  width="292"
  height="400"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/if/waving-flag.webp"
  alt="Jiki pronto a sventolare la bandiera a scacchi alla fine di una gara"
  width="266"
  height="400"
/>

Usiamo la parola chiave `if` in modo molto simile a `repeat`. Mettiamo delle informazioni tra parentesi tonde (`()`). In questo caso, quell'informazione è la condizione che vogliamo controllare. Poi mettiamo un blocco di codice tra le parentesi graffe (`{}`), e quel blocco viene eseguito solo se la condizione è vera.

```javascript
if (condition) {
}
```

E che aspetto hanno queste condizioni? Di solito sono una specie di confronto (_comparison_ in inglese). Confrontiamo due numeri o due stringhe e controlliamo se il risultato è vero o falso.

Pensa a questi confronti come a proposizioni (_statements_ in inglese) che potresti dire ad alta voce. Tre è minore di cinque. Vero. Sette è minore di due. Falso.

Per scrivere questi confronti usiamo dei simboli. Probabilmente li conosci già dalla matematica. Abbiamo minore, maggiore, minore o uguale, maggiore o uguale, e c'è anche un controllo per vedere se due cose sono la stessa cosa, cioè se sono uguali. Quest'ultimo è un po' diverso da quello a cui sei abituato, perché usiamo tre segni di uguale di fila per verificare se due cose sono uguali o diverse.

<img
  class="concept-image"
  src="/static/images/concept-assets/if/comparisons-symbols.webp"
  alt="Una tabella degli operatori di confronto: minore, maggiore, minore o uguale, maggiore o uguale, uguale e diverso, con esempi"
  width="449"
  height="400"
/>

Questo ci aiuta a non fare confusione con i momenti in cui impostiamo o aggiorniamo le variabili, dove usiamo un solo segno di uguale per dire "metti questo nella scatola". Ricorda: tre segni di uguale per confrontare.

Puoi confrontare anche le stringhe. Quindi `"hello"` uguale a `"hello"`: vero, le due stringhe sono identiche. Ma qui fai attenzione, perché Jiki confronta ogni singolo carattere delle due stringhe, su entrambi i fogli di carta. Quindi `"Hello"` con la H maiuscola non è uguale a `"hello"` con la h minuscola. Sono stringhe diverse. Confrontarle darebbe falso, perché la H maiuscola e la h minuscola sono caratteri diversi.

A proposito, vero e falso si chiamano booleani, un'altra parola che suona tecnica. Ma è davvero semplice: è solo un modo formale per dire che qualcosa è vero oppure falso. Quindi se incontri la parola "booleani", significa semplicemente vero o falso. Vediamolo in azione. Immaginiamo di costruire quel buttafuori robot per un locale, e stabiliamo che il buttafuori deve aprire la porta solo se la persona ha 21 anni o più. Abbiamo una funzione `askAge` (chiedi l'età), che possiamo usare per ottenere l'età di qualcuno, e salviamo il risultato in una variabile chiamata `age` (età). Poi possiamo dire: se quell'`age` è maggiore di 20, apriamo la porta. Quindi se `askAge` restituisce `30`, la apriamo, e se restituisce `12`, no.

```javascript
let age = askAge()
if (age >= 21) {
  openDoor()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/if/bouncer-open-close.webp"
  alt="Jiki che apre la porta a una persona abbastanza grande e rifiuta l'ingresso a una troppo giovane"
  width="410"
  height="400"
/>
