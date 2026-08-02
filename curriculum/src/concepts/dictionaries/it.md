---
title: "Dizionari"
description: "Una pagina di un blocco note a spirale in cui ogni voce ha una chiave a sinistra e il suo valore a destra, per avere dati etichettati invece di una lista."
en_md5: 3b1b01f6a914ffe1ce4a54e023e46bdd
---

Gli array sono la nostra prima scelta quando abbiamo una lista di qualcosa: una lista di mentori, una lista di punteggi, una lista di ingredienti. Per qualsiasi lista, ti conviene usare un array.

Ma c'è un'altra struttura dati molto comune per quando vuoi qualcosa di un po' più complesso di una lista.

Immagina di voler salvare alcune informazioni su di me: il mio nome, la mia età, dove sono nato. Potresti usare un array, ma non sarebbe molto chiaro che cosa rappresenta.

L'Inghilterra è dove sono nato o dove vivo? 42 è la mia età o qualcos'altro?

E se voglio usare questi dati, devo ricordarmi che la prima posizione è per il nome, la seconda per l'età, la terza per il luogo di nascita. È tutto un po' confuso, ed è confuso perché questa non è davvero una lista di cose. È qualcosa di più complesso. Ed è qui che entrano in gioco i dizionari. Un dizionario è un nuovo tipo di struttura dati. È la quinta che incontri: hai le stringhe, i numeri, i booleani, gli array e adesso i dizionari.

E voglio che tu pensi a un dizionario come al foglio di un blocco note a spirale.

Sul lato sinistro ci sono le intestazioni, le parole `"name"`, `"age"`, `"birthplace"`, e le chiamiamo chiavi (_keys_ in inglese).

E sul lato destro, accanto a ogni intestazione, ci sono i dati veri e propri, `"Jeremy"`, `42`, `"England"`, e li chiamiamo valori.

Proprio come gli array, un dizionario è una cosa sola. È una pagina di un blocco note. E proprio come gli array, Jiki può metterlo in una variabile, in una scatola, o usarlo come input per una funzione, oppure può tirare fuori un dizionario dallo scivolo. Ecco quindi come appare un dizionario nel codice. Usiamo le parentesi graffe (`{}`) per segnare l'inizio e la fine, e all'interno ci sono le coppie: una chiave a sinistra, i due punti e poi il valore a destra. E tra una coppia e l'altra mettiamo una virgola. Jiki vede tutto questo e tira fuori il suo blocco note a spirale. Scrive `name`, `"Jeremy"`, `age`, `42`, e così via per ogni coppia.

E quando ha finito, strappa il foglio e lo mette in una scatola etichettata person.

Ci sono alcune regole da conoscere. Le chiavi sono sempre stringhe. Devono avere le virgolette intorno, e ogni chiave deve essere unica. Non puoi avere due chiavi chiamate `name` nello stesso dizionario.

I valori possono anche essere uguali, se vuoi, ma le chiavi devono essere diverse.

E i valori possono essere qualsiasi cosa: stringhe, numeri, booleani, array o perfino altri dizionari.

Puoi anche avere un dizionario vuoto, proprio come avevamo un array vuoto, e partire da quello per costruirci sopra in seguito.

Quindi adesso hai un dizionario, ma come tiri fuori qualcosa?

Usiamo la stessa sintassi con le parentesi quadre (`[]`) che abbiamo usato con gli array e le stringhe, ma invece del numero di una posizione inseriamo una chiave. Quindi, se vogliamo tirare fuori il nome di qualcuno da un dizionario, scriviamo:

```javascript
person["name"] // "Jeremy"
```

E questo dice a Jiki di guardare nel dizionario `person`, trovare la chiave `"name"` e tirare fuori il suo valore. Jiki va alla scatola person, tira fuori la pagina del blocco note, scorre tutte le chiavi finché non trova `"name"`, poi legge il valore, `"Jeremy"`, e lo mette in una nuova scatola chiamata name.

Le parentesi quadre significano sempre la stessa cosa: stai frugando dentro qualcosa per tirarne fuori qualcos'altro. Con gli array e le stringhe usi un numero per dire da quale posizione vuoi prendere qualcosa. Con i dizionari usi una stringa per la chiave.

L'idea è la stessa, cambia solo un po' la sintassi.
