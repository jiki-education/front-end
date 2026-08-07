---
title: "Suoni di gocce di pioggia"
description: "Trasforma i numeri in suoni di gocce di pioggia: Pling, Plang e Plong."
en_md5: 93b85e63b3d48e4e7f6d249592b367a1
---

Raindrops è una versione del classico problema FizzBuzz usato da sempre nei colloqui di programmazione.

Il tuo compito è convertire un numero nei suoi corrispondenti suoni di gocce di pioggia.

Lo facciamo vedendo per quali numeri è divisibile (ad esempio, il numero 10 è divisibile per 1, 2, 5 e 10. Il numero 12 è divisibile per 1, 2, 3, 4, 6 e 12).

Se un dato numero:

- è divisibile per 3, aggiungi "Pling" al risultato.
- è divisibile per 5, aggiungi "Plang" al risultato.
- è divisibile per 7, aggiungi "Plong" al risultato.
- non è divisibile per 3, 5 o 7, il risultato deve essere il numero come stringa.

Devi creare una funzione chiamata `raindrops(num)` (gocce di pioggia) che prende il numero come input e restituisce i suoi suoni delle gocce corrispondenti.

Costruisci il risultato usando la stringa concatenata (`+`) o una stringa interpolata (_template string_ in inglese).

### Esempi

- `raindrops(28)` restituisce "Plong" perché 28 è divisibile per 7, ma non per 3 o 5.
- `raindrops(30)` restituisce "PlingPlang" perché 30 è divisibile per 3 e 5, ma non per 7.
- `raindrops(34)` restituisce "34" perché 34 non è divisibile per 3, 5 o 7.
