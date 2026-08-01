---
title: "Radice numerica"
description: "Riduci un numero a una sola cifra sommando ripetutamente le sue cifre."
en_md5: 9847d9ea8c4a86ad65869e4f7b4c718e
---

La radice numerica (_digital root_ in inglese) di un numero è ciò che ottieni continuando a sommare le sue cifre finché non resta una sola cifra.

Se sommando le cifre una volta ottieni ancora più di una cifra, sommi le cifre di _quel_ risultato, e vai avanti finché non rimane una sola cifra.

Per esempio, per trovare la radice numerica di `942`:

```
9 + 4 + 2 = 15
1 + 5 = 6
```

Quindi la radice numerica di `942` è `6`.

Un numero che è già composto da una sola cifra (come `7`) è la propria radice numerica.

Crea una funzione chiamata `digitalRoot` che prende un numero e restituisce la sua radice numerica.

### La funzione `String()`

Nelle ultime lezioni hai avuto a disposizione la funzione `Number(str)`, che converte una stringa in un numero.

Puoi fare la stessa cosa al contrario e trasformare un numero in una stringa con la funzione `String(num)`. Per esempio:

```js
String(147) === "147"
```

Anche qui, nota la lettera maiuscola all'inizio, e anche qui non preoccuparti del perché per ora!

### Mettiamo in pratica quello che hai imparato.

Anche se ci sono tanti modi per risolvere questo esercizio, la soluzione a cui vogliamo che tu arrivi usa un ciclo `while`.

Buon divertimento!
