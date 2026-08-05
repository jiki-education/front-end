---
title: "Scrivere le tue funzioni"
description: "Usare la parola chiave `function` per costruire le tue macchine che Jiki può mettere sui suoi scaffali e riutilizzare."
en_md5: 93286a30a373b5604b60b3c109ad00a3
---

Finora, hai usato funzioni che sono state create per te, funzioni come `circle`, `rectangle`, `moveRight`, `shoot`. Tutte queste sono funzioni che sono state create e messe sugli scaffali di Jiki.

Ma ora è il momento di iniziare a creare le tue funzioni.

Per mostrarti come fare, vediamo come costruire una nuova funzione per il labirinto chiamata `walk5` (cammina5).

Questa funzione sposterà sempre il personaggio di cinque passi in avanti. Ammettiamolo, non è la funzione più utile del mondo, ma è semplice e comoda per iniziare.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions/walk-grid.webp"
  alt="Il personaggio sulla griglia del labirinto, pronto a camminare cinque passi in avanti"
  width="500"
  height="314"
/>

Quindi se ti chiedessi di scrivere del codice per far avanzare il personaggio di cinque passi, potresti scrivere `move` (muovi) cinque volte, oppure potresti usare un ciclo `repeat`. In questo esempio, per semplicità, useremo l'approccio di scrivere `move` cinque volte di seguito.

```javascript
move()
move()
move()
move()
move()
```

Quindi questo è ciò che vogliamo all'interno della nostra funzione.

Ora, aggiungi sotto una riga che dica a Jiki di usare questa funzione. L'hai già visto molte volte.

E poi il nostro compito sarà racchiudere tutte queste prime cinque righe in una funzione, in modo che quando Jiki usa `walk5`, siano proprio quelle prime cinque righe di codice a essere eseguite.

Per trasformare queste cinque righe in una funzione, queste cinque `move` in una funzione, dobbiamo usare una nuova parola chiave: la parola chiave `function`.

Quando usiamo la parola chiave `function`, dobbiamo fare due cose. Uno, specificare il nome della funzione. In questo caso, è `walk5`. E due, usare le parentesi graffe (`{}`) per racchiudere del codice che dice: «Questo è ciò che devi fare all'interno della funzione». Quindi possiamo aggiungerlo al nostro codice dicendo a Jiki di creare una funzione chiamata `walk5` e, quando `walk5` viene usata, deve eseguire queste cinque righe di codice.

```javascript
function walk5() {
  move()
  move()
  move()
  move()
  move()
}
```

Quando Jiki vede la parola chiave `function`, andrà a costruire una nuova macchina, metterà quelle istruzioni su una lavagna al suo interno e poi attaccherà un'etichetta sulla macchina per `walk5`. E poi metterà quella macchina sugli scaffali insieme a tutte le altre che ci sono.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions/jiki-machine-whiteboard.webp"
  alt="Jiki in piedi accanto a una nuova macchina con una lavagna al suo interno per scrivere le istruzioni della funzione"
  width="500"
  height="396"
/>

Ora, non c'è niente di speciale in questa funzione che hai creato rispetto a quelle predefinite (_built-in_ in inglese). Stanno tutte una accanto all'altra sui suoi scaffali.

E quando usi la funzione, quando scrivi `walk5()`, Jiki andrà semplicemente a prendere la macchina dagli scaffali e la userà esattamente come ha fatto con qualsiasi altra funzione. Puoi immaginare che ogni macchina abbia un mini Jiki che ci vive dentro. Mini Jiki ha sempre un bel cappello. E quel mini Jiki lavora esattamente come il Jiki normale all'esterno, seguendo le istruzioni allo stesso modo.

Un aspetto fondamentale da capire qui è che quando Jiki crea la funzione, in realtà non esegue il codice. Sta solo scrivendo quel codice per usarlo dopo.

Il personaggio nel labirinto non si muove a questo punto, quando scrivi la parola chiave `function`.

Jiki ha costruito la macchina e l'ha messa sugli scaffali. È solo quando gli dici di usare la macchina scrivendo `walk5()` che succede veramente.
