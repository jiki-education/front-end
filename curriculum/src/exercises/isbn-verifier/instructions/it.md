---
title: "Verifica ISBN"
description: "Controlla se il numero ISBN di un libro è valido."
en_md5: 1f50053213b8649f126851f264174e53
---

Ogni libro ha un ISBN, un numero di 10 cifre che lo identifica in modo univoco. Ogni ISBN è unico e segue un formato specifico. C'è anche un processo di verifica formale per controllare che una stringa sia un ISBN, e sarà quello che realizzerai in questo esercizio.

Gli ISBN di solito contengono trattini e hanno questa forma: `3-598-21508-8`

(Esistono anche ISBN a 13 cifre, ma per questo esercizio puoi ignorarli senza problemi!)

### Verifica di un ISBN

Per verificare un ISBN:

- Partiamo da sinistra e sommiamo ogni cifra moltiplicata per un peso che va da 10 a 1 in ordine decrescente.
- Calcoliamo il resto della divisione di quella somma per 11.
- Controlliamo se il resto è zero.

Ad esempio, per l'ISBN `3-598-21508-8`, verificheremmo se:

```
(3*10 + 5*9 + 9*8 + 8*7 + 2*6 + 1*5 + 5*4 + 0*3 + 8*2 + 8*1) % 11 === 0
```

Poiché il risultato è 0, questo prova che il nostro ISBN è valido.

Un altro paio di note importanti:

- A volte un ISBN può terminare con una X. In quel caso, la X rappresenta `10`. Se la X compare in qualsiasi altra posizione, l'ISBN non è valido.
- Gli ISBN possono essere scritti con o senza trattini.
- Qualsiasi altro carattere rende l'ISBN non valido.

### Il tuo compito

Crea una funzione chiamata `isValidIsbn(isbn)` (verifica se l'ISBN è valido) che accetta una stringa ISBN e restituisce `true` se è valida e `false` se non lo è.

### La funzione Number(...)

Una cosa che non abbiamo ancora trattato, ma che devi sapere, è la funzione `Number(str)`. È una funzione che prende una stringa e restituisce quella stringa come numero. Quindi se scrivi `Number("1234")` ottieni `1234`. È una funzione un po' strana perché inizia con la lettera maiuscola. Non preoccupartene per ora: spiegheremo il motivo molto più avanti.

Scopri di più sulla <a href="/concepts/type-conversion" target="_blank" rel="noopener noreferrer">pagina del concetto di conversione di tipo</a>.

### Usare ciò che hai appena imparato

Come nell'esercizio precedente, anche se ci sono molti modi validi per risolvere questo esercizio, la soluzione che vogliamo che tu trovi utilizza un'istruzione `continue`.

Lo scenario bonus ti sfida a risolverlo in 22 righe di codice. Ci sono soluzioni più brevi, ma se arrivi a 22 righe, hai fatto un buon lavoro di ottimizzazione.

Buon divertimento!
