---
title: "Conversione di tipo"
description: "Trasformare un valore da un tipo all'altro, come convertire una stringa di cifre in un numero con `Number()`, o un numero in una stringa con `String()`."
en_md5: 8d85e3d274a6cdfdb74bd0488b685f18
---

Ogni valore nei nostri programmi ha un tipo. `"7"` è una stringa e `7` è un numero. Possono sembrare quasi identici, ma Jiki li tratta in modo molto diverso. Non puoi sommare la stringa `"7"` al numero `3` e aspettarti di ottenere `10`, perché una è un pezzo di testo e l'altro è una quantità.

Abbastanza spesso abbiamo bisogno di spostare un valore da un tipo a un altro. Questo si chiama «conversione di tipo», e ci sono due conversioni che userai sempre.

### Convertire una stringa in un numero

Quando leggi i caratteri da una stringa, ogni carattere è a sua volta una stringa, anche quando sembra una cifra. Prima di poterci fare qualsiasi calcolo, devi trasformarlo in un vero numero. Lo facciamo con `Number()`.

```javascript
Number("7")
// 7

Number("42")
// 42
```

Una volta che hai un numero vero, puoi sommarlo, moltiplicarlo e tutto il resto.

```javascript
let digit = Number("7")
let doubled = digit * 2
// 14
```

Se passi a `Number()` qualcosa che non è un numero valido, come `Number("cat")`, non otterrai affatto un numero, quindi vale la pena assicurarsi di darle solo stringhe che siano davvero cifre.

### Convertire un numero in una stringa

La direzione opposta è altrettanto utile. A volte hai un numero e vuoi trattarlo come testo, magari per unirlo a un'altra stringa o per guardare le sue singole cifre. Lo facciamo con `String()`, l'immagine speculare di `Number()`.

```javascript
String(42)
// "42"

let count = 7
String(count)
// "7"
```

Ora che è una stringa, puoi usare tutti i soliti strumenti per stringhe, come leggerla carattere per carattere o controllare la sua lunghezza.
