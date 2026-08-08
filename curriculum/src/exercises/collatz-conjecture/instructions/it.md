---
title: "Congettura di Collatz"
description: "Esplora un famoso rompicapo matematico con la tua funzione."
en_md5: e4f7ab61c163cdb7c2eb2b6541a2cedc
---

Una sera, ti sei imbattuto in un vecchio taccuino pieno di scarabocchi criptici, come se qualcuno fosse ossessionato da un'idea. Su una pagina, una sola domanda spiccava: **Ogni numero può trovare la via per 1?** Era legato a qualcosa chiamato **Congettura di Collatz**, un rompicapo che ha lasciato perplessi i pensatori per decenni.

Le regole sono ingannevolmente semplici:

1. Scegli un numero.
2. Se è pari, dividilo per 2.
3. Se è dispari, moltiplicalo per 3 e poi aggiungi 1.
4. Ripeti con il risultato, continuando all'infinito.

Per esempio, partendo da 12:

```
12 → 6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1
```

Contando dal secondo numero (6), ci sono voluti 9 passi per arrivare a 1.

Crea una funzione chiamata `collatzSteps` (passi di Collatz) che riceve un input, un numero. Restituisci **quanti passi** ci vogliono per arrivare da un numero qualsiasi a 1, seguendo le regole della Congettura di Collatz.
