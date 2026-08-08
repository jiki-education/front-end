---
title: "Cena formale"
description: "Cerca il tavolo a cui è seduto un ospite a partire dal piano dei posti a tavola."
en_md5: b93bf1949411dbc2a19e5b48c3ae869a
---

Sei tornato al tuo secondo lavoro come buttafuori. È la sera dopo l'After Party, e c'è un'altra festa. Questa volta è una cena formale, quindi stasera sei meno "uomo robusto alla porta" e più "persona con un bloc-notes e un bel panciotto".

Questo non è decisamente il posto per usare **solo** il tuo nome. Anzi, non è proprio il posto per usare il tuo nome. Qui, tutti vengono chiamati con un appellativo (_honorific_ in inglese) (Miss, Mr, Dr, ecc.) e il proprio cognome.

Gli organizzatori ti hanno consegnato il piano dei posti a tavola sotto forma di due liste separate. Una contiene i nomi completi degli invitati. L'altra contiene il nome del tavolo a cui ogni invitato è seduto (che prendono il nome da alberi e fiori). Come per "After Party", le due liste sono allineate: l'invitato alla posizione 3 della prima lista siede al tavolo alla posizione 3 della seconda.

Quindi quando il signor Pitt fa il suo ingresso, devi capire che si tratta del "Brad Pitt" sulla tua lista, e poi dirgli a che tavolo è seduto.

Scrivi una funzione chiamata `tableFor` (cerca il tavolo a cui un ospite è seduto). La funzione ha tre input:

- Il primo è la lista dei nomi completi degli invitati, come stringhe
- Il secondo è la lista dei nomi dei tavoli, nello stesso ordine degli invitati
- Il terzo è l'ospite in arrivo, formattato come un appellativo seguito dal cognome (ad es. "Mr Pitt")

Restituisci il nome del tavolo a cui l'ospite è seduto. Se non è affatto nel piano dei posti, restituisci invece la stringa `"No table found"` (niente tentativi di fortuna, qui!).

L'appellativo è sempre esattamente una parola, e tutto ciò che segue è il cognome dell'ospite. La maggior parte dei cognomi è di una parola, ma alcuni più illustri sono composti da due.

Fai attenzione, però. Molti cognomi somigliano molto ad altri cognomi.

### Metodi e proprietà di stringhe e array

Oltre alla proprietà `.length` che hai conosciuto nell'ultimo esercizio, ci sono quattro metodi che potresti trovare utili. Ci sono molti modi per risolvere questo esercizio, ma questi ti porteranno alla soluzione più breve possibile.

`"...".split(substring)` suddivide una stringa usando un'altra stringa. Ad esempio:

```js
`"Jeremy".split("e")`
// ["J", "r", "my"]
```

`[...].slice(start)` cattura una parte di un array, a partire dall'indice `start` e proseguendo fino alla fine dell'array. Gli elementi catturati vengono copiati in un NUOVO array, che ti viene restituito. Di fatto, questo rimuove i primi `start` elementi. Ad esempio:

```js
["Jeremy", "Erik", "Aron", "DJ", "Glenn", "Isaac", "Bethany"].slice(2)
// ["Aron", "DJ", "Glenn", "Isaac", "Bethany"]
```

`[...].join(string)` unisce gli elementi di un array usando la stringa fornita. Ad esempio:

```js
["Jeremy", "Erik", "Aron", "DJ", "Glenn", "Isaac", "Bethany"].join(" likes ")
// Jeremy likes Erik likes Aron likes DJ likes Glenn likes Isaac likes Bethany
```

`"...".endsWith(string)` ti dice se una stringa termina con un'altra stringa. Ad esempio:

```js
"Jeremy".endsWith("emy")
// true

"Jeremy".endsWith("Jer")
// false
```
