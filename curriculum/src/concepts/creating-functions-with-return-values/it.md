---
title: "Aggiungere il return alle funzioni"
description: "Usare la parola chiave `return` per dotare le tue funzioni di uno scivolo di output che restituisce un valore a chi le chiama."
en_md5: 51d31f709a7051c29b499a31ad68555e
---

Adesso sai creare funzioni con e senza input. C'è un'ultima cosa da imparare, e poi sarai un esperto nella creazione di funzioni: come dare alle tue funzioni uno scivolo.

Hai già usato tante funzioni che restituiscono cose. `isAlienAbove` (verifica se c'è un alieno sopra) ti restituisce vero o falso. `Math.randomInt(1, 10)` (un numero intero casuale) ti restituisce un numero casuale.

Quando Jiki usa quelle funzioni, qualcosa esce dallo scivolo di output, che poi può utilizzare.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-return-values/output-chute.webp"
  alt="Jiki che raccoglie un valore che esce dallo scivolo di output di una macchina"
  width="500"
  height="312"
/>

Quindi, per farlo, ci serve un'altra nuova parola chiave, e cioè `return`.

La parola chiave `return` dice a Mini Jiki di spingere qualcosa fuori dallo scivolo.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-return-values/return-keyword-push.webp"
  alt="Mini Jiki all'interno della macchina che spinge il valore 42 fuori dallo scivolo di output"
  width="500"
  height="335"
/>

Allora, creiamo una funzione e diamole il nome `meaningOfLife` (senso della vita), e il suo compito è sempre e solo restituire il numero `42`. Non riceve input. La scriviamo in questo modo:

```javascript
function meaningOfLife() {
  return 42
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-return-values/meaning-of-life-42.webp"
  alt="La macchina meaningOfLife che invia il numero 42 fuori dal suo scivolo di output"
  width="500"
  height="323"
/>

Ora, ovunque usiamo `meaningOfLife()` nel nostro codice, otteniamo il numero `42` da usare proprio come qualsiasi altro valore. Possiamo metterlo in una scatola con `let`, passarlo come input a un'altra funzione, o usarlo in un'istruzione `if`.

Le funzioni che restituiscono valori possono anche ricevere input. Potresti scrivere una funzione `ageBracket(age)` (fascia d'età) che restituisce `"Sorry, too young"` quando `age` è inferiore a 18, e `"Welcome"` altrimenti. Chi la chiama riceve la stringa che la funzione ha restituito.

```javascript
function ageBracket(age) {
  if (age >= 18) {
    return "Welcome"
  }
  return "Sorry, too young"
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-return-values/age-input.webp"
  alt="Un valore di età che viene lasciato cadere nella fessura di input della macchina, in modo che possa decidere cosa restituire"
  width="487"
  height="400"
/>

Questo è il cuore della programmazione. Creiamo tanti piccoli mattoncini come questo e poi li mettiamo insieme per formare programmi.
