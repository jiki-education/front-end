---
title: "La parola chiave `and`"
description: "Combinare due condizioni con `&&`: l'intera condizione è vera solo se entrambe le parti sono vere."
en_md5: 6ea0de65a81d8e5c8d2eb89f3db29705
---

Se ti chiedessi di aprire la porta solo se qualcuno ha più di 20 anni, probabilmente sapresti cosa fare. Ma se dovessi controllare se qualcuno ha più di 20 anni _e_ indossa l'abito giusto? Dovresti verificare due condizioni diverse contemporaneamente. Come faresti?

Potresti usare un'istruzione if annidata (_nested_ in inglese), un po' come i cicli annidati di prima. Quindi potresti dire: se `age` è maggiore di `20`, allora entriamo in questo blocco di codice, e poi un altro if in cui `outfit` è uguale a `"disco"`, un'altra parentesi graffa e un nuovo blocco di codice. Funzionerebbe, ma diventa abbastanza disordinato, soprattutto quando vuoi avere molte condizioni.

Per fortuna, c'è un modo più semplice: avere condizioni che hanno più parti. Invece di controllare una sola cosa nella condizione, possiamo controllare due, tre o più cose. E per farlo, dobbiamo usare la parola chiave `and`. Ora, purtroppo, in JavaScript, la parola chiave `and` non è proprio la parola «and», come succede in alcuni linguaggi. Invece, devi mettere due e commerciali (_ampersand_ in inglese) una accanto all'altra. Dovrai ricordartelo. È fastidioso, ma è così, e ti ci abituerai.

Quindi possiamo usarlo per creare una condizione più complessa. Possiamo dire: se `age` è maggiore di `20` e `outfit` è `"disco"`, allora andiamo avanti. Se `age` è minore di `20` o `outfit` non è `"disco"`, allora l'intera istruzione, l'intera condizione è falsa. Se hai mai studiato logica, magari hai fatto un po' di elettronica o matematica più avanzata, allora questo ti sembrerà molto naturale. Altrimenti, imparerai in fretta.

```javascript
if (age > 20 && outfit === "disco") {
  openDoor()
}
```

C'è una cosa che fa inciampare le persone sia con and che con or: ogni lato della condizione e/o deve essere un confronto completo. Quindi, anche se confronti la stessa variabile su entrambi i lati, devi ripeterla. Non puoi scrivere «if age è maggiore di 13 e minore di 20». Devi scrivere «if age è maggiore di 13 e age è minore di 20». Entrambi i lati devono essere confronti completi.

```javascript
if (age > 13 && age < 20)
```
