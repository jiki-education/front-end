---
title: "Hamming"
description: "Conta le differenze tra due filamenti di DNA."
en_md5: 629f74899d402283c34d3bfbb17777b8
---

Questo è un classico esercizio di Exercism sulla biologia molecolare!

Il tuo corpo è fatto di cellule che contengono DNA. Queste cellule si usurano regolarmente e devono essere sostituite, cosa che ottengono dividendosi in cellule figlie. Infatti, il corpo umano medio vive circa 10 biliardi di divisioni cellulari nell'arco di una vita!

Quando le cellule si dividono, anche il loro DNA si replica. A volte, durante questo processo, si verificano errori e singoli pezzi di DNA vengono codificati con l'informazione sbagliata. Se confrontiamo due filamenti di DNA e contiamo le differenze tra loro, possiamo vedere quanti errori si sono verificati. Questa è nota come "distanza di Hamming".

La distanza di Hamming è utile in molti ambiti scientifici, non solo in biologia, quindi è una bella espressione da conoscere!

Il tuo compito è calcolare la distanza di Hamming tra due filamenti di DNA. Il DNA usa le lettere C, A, G e T. Due filamenti potrebbero apparire così:

    GAGCCTACTAACGGGAT
    CATCGTAATGACGGCCT
    ^ ^ ^  ^ ^    ^^

Hanno 7 differenze, quindi la distanza di Hamming è 7.

Crea una funzione chiamata `hammingDistance` (distanza di Hamming) che ha due input: i due filamenti di DNA come stringhe. Dovrebbe restituire un numero come distanza.

Entrambi i filamenti di DNA avranno sempre la stessa lunghezza.
