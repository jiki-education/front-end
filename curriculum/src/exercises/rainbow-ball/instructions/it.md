---
title: "Palla arcobaleno"
description: "Crea una palla che rimbalza e lascia una scia color arcobaleno sull'area di disegno."
en_md5: 501aa30e85d8fceb38890c72be4a0b87
---

Il tuo compito è creare una palla che rimbalza in modo casuale sull'area di disegno, disegnando un arcobaleno dietro di sé.

Dovrebbe apparire più o meno così:

<img src="/static/images/exercise-assets/rainbow-ball/example.gif" alt="Palla arcobaleno animata che rimbalza sull'area di disegno lasciando una scia colorata" style="width: 100%; max-width: 200px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

Come parte di questo esercizio, hai a disposizione la funzione `Math.randomInt(min, max)` (restituisce un numero intero casuale tra i limiti forniti), che restituisce un numero intero casuale compreso tra i valori di `min` e `max` che le passi.

Prenditi qualche minuto per pensare a come potresti risolvere il problema. Questa è la parte più preziosa dell'esercizio, quindi prenditi il tuo tempo e **scrivi le tue idee prima di leggere la formula qui sotto.**

Quando hai un'idea del tuo approccio, prosegui con la lettura. Ma non continuare finché non ci hai pensato un po'!

## La formula

Questo progetto consiste nell'avere alcune variabili che gestiscono la posizione della palla, che aumentano o diminuiscono progressivamente, ed altre variabili che controllano **come** la palla si sta muovendo e che cambiano quando certe condizioni sono soddisfatte.

### Disegno

- Il primo cerchio che disegni deve essere posizionato a `(5, 5)`.
- Tutti i cerchi devono avere un raggio di `10`.
- Il colore del cerchio deve usare il modello HSL, partendo da una tonalità di `100` (verde), una saturazione di `80` (colori vivaci) ed una luminosità di `50` (luminosità media).

### Animazione

- Per cominciare, ad ogni iterazione devi spostare la palla di `2` verso destra e `1` verso il basso.
- La tonalità deve aumentare di `1` ad ogni iterazione, fino a raggiungere il valore massimo (`360`), per poi iniziare a diminuire. Saturazione e luminosità non devono cambiare.

### Rimbalzo

- Quando la palla raggiunge il bordo dell'area di disegno, deve cambiare direzione. (Consulta i suggerimenti se non riesci a capire come fare.)
- Per rendere le cose più divertenti, devi cambiare direzione usando la funzione `Math.randomInt(min, max)`. Scegli i valori di `min` (il valore minimo) e `max` (il valore massimo) che diano lo stile di animazione che preferisci.

## Per superare i controlli

Ti abbiamo lasciato molta libertà in questo esercizio. Verifichiamo che:

- I primi cerchi siano corretti.
- Oltre l'80% dell'area di disegno venga colorata.

I numeri che scegli per ottenere questo risultato dipendono da te. Probabilmente vorrai un blocco `repeat` che itera tra `500` e `1000` volte.

## Scomponi il problema...

La chiave di questo esercizio è fare le cose una alla volta:

1. Fai in modo che la palla cambi colore mentre si muove
2. Fai in modo che rimbalzi sul lato destro
3. Fai in modo che rimbalzi sul fondo.
4. Fai in modo che rimbalzi in modo casuale
