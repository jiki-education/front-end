---
title: "Risolvi il labirinto in modo programmatico"
description: "Scrivi il codice che percorre qualsiasi labirinto da solo."
en_md5: d3f3c0d2727632fe7872d07e1c2cd99a
---

Nel primo esercizio sul labirinto hai spostato il tuo personaggio manualmente all'interno del labirinto. Ora sei pronto a risolvere qualsiasi labirinto in modo programmatico usando il codice!

Per farlo, hai tre nuove funzioni:

- `canTurnLeft()` (può girare a sinistra): restituisce `true` se lo spazio alla sinistra del personaggio non è occupato da un muro.
- `canTurnRight()` (può girare a destra): restituisce `true` se lo spazio a destra del personaggio non è un muro.
- `canMove()` (può muoversi): restituisce `true` se lo spazio davanti al personaggio non è un muro.

Quando le abbiniamo a `move()` (muovi), `turnLeft()` (gira a sinistra) e `turnRight()` (gira a destra) che avevi già, è possibile scrivere un algoritmo per risolvere **qualsiasi** labirinto. «Algoritmo» è una parola tecnica che significa semplicemente «un modo di fare qualcosa». È come seguire le istruzioni di una formula o di una ricetta.

Più avanti nelle istruzioni ti dirò l'algoritmo, pronto da usare. Ma voglio che tu provi a capirlo da solo prima, come un piccolo rompicapo logico. Se sai se puoi girare a sinistra, a destra o andare avanti, come puoi risolvere qualsiasi labirinto che ti do?

Una volta capito, o se ti blocchi, scorri verso il basso per vedere la soluzione e quello che devi scrivere nel codice.

<hr style="border-top: 1px solid var(--color-gray-200); margin:40px 0"/>

### L'algoritmo

OK, è stata una richiesta difficile, quindi immagino che tu abbia avuto qualche idea ma non l'abbia risolta del tutto. Ecco i passi che devi seguire:

- Se puoi girare a sinistra, gira a sinistra e vai avanti.
- Altrimenti, se puoi andare avanti, vai avanti.
- Altrimenti, se puoi girare a destra, gira a destra e vai avanti.
- Altrimenti, girati.

Se fai così, puoi risolvere qualsiasi labirinto!

Scrivi queste istruzioni in codice. Divertiti!
