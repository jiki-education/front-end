---
title: "Codifica Run-Length"
description: "Comprimi e decomprimi il testo contando le sequenze di caratteri ripetuti."
en_md5: a176be7e6ed782e9aa4b54a4575f751f
---

La codifica run-length (_Run-Length Encoding_ in inglese) è una forma semplice di compressione. Le sequenze di caratteri uguali consecutivi vengono sostituite da un numero seguito da quel singolo carattere. I caratteri che compaiono una sola volta vengono lasciati così come sono, senza alcun numero davanti.

Ad esempio, `"AABBBCCCC"` si codifica in `"2A3B4C"`, e `"XYZ"` (nessuna ripetizione) si codifica semplicemente in `"XYZ"`.

Lo spazio bianco conta come un carattere come tutti gli altri, quindi `"  hsqq qww  "` si codifica in `"2 hs2q q2w2 "`.

### Due funzioni

Scrivi due funzioni:

- `encode` (codificare) prende una stringa e ne restituisce la codifica run-length.
- `decode` (decodificare) prende una stringa codificata e restituisce il testo originale.

La decodifica inverte il processo: un numero ti dice quante volte ripetere il carattere che lo segue. Ricorda che una sequenza di caratteri ripetuti può essere più lunga di 9, quindi un conteggio può avere più di una cifra (ad esempio `"12W"` significa dodici `W`).

### Mettere in pratica ciò che hai imparato.

Anche se ci sono molti modi per risolvere questo esercizio, la soluzione che vogliamo che tu trovi utilizza un ciclo `for` del tipo che hai imparato nell'ultimo video. Dai un'occhiata ai concetti in fondo se hai bisogno di un ripasso sulla sintassi, perché è piuttosto bruttina!

Divertiti!
