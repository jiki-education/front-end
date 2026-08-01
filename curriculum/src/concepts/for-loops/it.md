---
title: "I cicli for"
description: "Un ciclo con tre parti (un inizializzatore, una condizione e un incremento) che ti dà il pieno controllo sull'iterazione."
en_md5: e96f2e5a4106a88cfbca449c93a26108
---

Forse ricordi che il ciclo repeat non esiste davvero in JavaScript. È solo qualcosa che abbiamo aggiunto per renderti la vita un po' più facile all'inizio.

Quindi cosa usiamo al suo posto? Usiamo un normale ciclo `for`, che ha questo aspetto.

```javascript
for (let i = 0; i < 5; i++) {
  // ...
}
```

Capisci perché il primo giorno poteva intimidirti un po'.

Ora però hai tutte le conoscenze che ti servono per prenderci confidenza. Analizziamolo insieme.

Un ciclo for ha tre componenti: un inizializzatore, una condizione e un incremento.

L'inizializzatore, la parte `let i = 0`, viene eseguito all'inizio dell'intero ciclo. Viene eseguito una volta sola e, in questo caso, crea una scatola chiamata `i` impostata a zero. `i` è solo una lettera usata per tenere traccia di un valore mentre il ciclo va avanti: per tradizione si usa `i` o `x`.

La parte successiva, la condizione, viene eseguita ogni volta, prima di ogni iterazione del ciclo.

Se la condizione è vera, eseguiamo di nuovo il ciclo.

Se non lo è, ci fermiamo.

E infine c'è l'incremento, cioè `i++`.

`i++` significa semplicemente la stessa cosa di `i = i + 1`. È solo una scorciatoia, un modo per aumentare `i` di uno ogni volta.

Quindi, in questo esempio, impostiamo `i` a zero. Controlliamo se `i` è minore di due, e lo è, quindi eseguiamo il ciclo.

Alla fine aumentiamo `i` di uno, così `i` diventa uno. Zero più uno fa uno.

Poi ripartiamo. Controlliamo se uno è minore di due.

Lo è, quindi eseguiamo il ciclo. Alla fine aumentiamo di nuovo `i`. Ora vale due: uno più uno fa due.

```javascript
i = 0
i < 2 // true - eseguiamo il ciclo
...   // Facciamo l'iterazione
i = i + 1 // 1

i < 2 // true - eseguiamo il ciclo
...   // Facciamo l'iterazione
i = i + 1 // 2

i < 2 // false - usciamo dal ciclo
```

Poi ci proviamo una terza volta. Questa volta controlliamo se due è minore di due, e non lo è, quindi non eseguiamo il ciclo: anzi, il ciclo è proprio finito. Passiamo semplicemente al codice che viene dopo. In tutto abbiamo eseguito il ciclo due volte, ed è una cosa utile da sapere: finché partiamo da zero e usiamo una condizione `i < n`, il numero `n` è il numero di volte che il ciclo verrà eseguito.

Quindi equivale a scrivere repeat due.

Non è difficile, ma è molto più macchinoso che scrivere semplicemente repeat due. Il vantaggio di un ciclo for è che in quelle tre posizioni puoi fare qualsiasi cosa. Puoi partire da un numero diverso, contare a passi maggiori di uno, contare all'indietro, o usare una condizione che dipende da qualcosa di diverso da un semplice contatore. È questa flessibilità a rendere i cicli for il cavallo di battaglia di JavaScript.
