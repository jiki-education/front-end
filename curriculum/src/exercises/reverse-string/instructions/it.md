---
title: "Inverti una stringa"
description: "Capovolgi un testo all'indietro."
en_md5: 9d47faf87b2864284ed64ce1300073ea
---

Invertire le stringhe (leggerle da destra a sinistra, anziché da sinistra a destra) è un compito sorprendentemente comune nella programmazione.

Per esempio, in bioinformatica, invertire la sequenza di stringhe di DNA o RNA è spesso importante per diverse analisi, come trovare filamenti complementari o identificare sequenze palindrome.

Il tuo compito è creare una funzione chiamata `reverse` (inverti), che prende una stringa come input e restituisce la versione invertita.

Esempi:

- Trasforma «stressed» in «desserts»
- Trasforma «strops» in «sports»
- Trasforma «racecar» in «racecar» (un palindromo)

### Quegli ultimi due scenari...

Gli ultimi due scenari sembrano strani, vero? Cosa sta succedendo?

Si scopre che molti emoji sono in realtà composti da altri emoji uniti insieme con spazi nascosti a larghezza zero.

L'emoji famiglia (👩‍👩‍👧‍👦) è composto da due donne e due bambini. Quando viene invertito, puoi vedere i singoli caratteri (👦‍👧‍👩‍👩).

L'altro è un arcobaleno ed una bandiera (🌈‍️🏳). Quando inverti l'ordine per ottenere prima la bandiera e poi l'arcobaleno, diventa una bandiera arcobaleno (🏳️‍🌈️)!

Se costruisci il tuo risultato un carattere alla volta, questi dovrebbero funzionare senza problemi. Se invece cerchi un trucco più astuto, potresti scoprire che gli emoji si spezzano.
