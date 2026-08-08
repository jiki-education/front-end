---
title: "Scorri e spara"
description: "Scorri tra gli Space Invaders ed elimina gli alieni."
en_md5: a238bdc121bdfe425015d2e9e6b872d5
---

Siamo tornati con Space Invaders. La scorsa volta ti bastava spostarti da sinistra a destra per abbattere tutti gli alieni. Ma questa volta devi anche far rimbalzare il laser da sinistra a destra, facendo più passaggi per abbattere gli alieni.

Puoi muovere il laser a sinistra e a destra usando le funzioni `moveLeft()` (muovi a sinistra) e `moveRight()` (muovi a destra). Puoi sperimentare per vedere quanto puoi spostarti a sinistra e a destra. Se esci dai bordi dello schermo, perdi.

Come prima, quando ti sposti, devi controllare se c'è un alieno sopra di te usando la funzione `isAlienAbove()` (controlla se c'è un alieno sopra) e poi sparargli con `shoot()` (spara) se è presente. Se spari quando non c'è un alieno, perdi la partita: sprecare munizioni non è permesso!

Il cannone laser si surriscalda facilmente. Devi muoverti tra un colpo e l'altro per mantenerlo freddo.

Le ondate si fanno più intense man mano che vai avanti. Nell'ondata finale gli alieni riappaiono, quindi non c'è modo di sapere in anticipo quanti colpi ti serviranno: il tuo ciclo deve continuare a eseguire finché tutti gli alieni non sono stati eliminati.

Una regola di questo esercizio, per superare lo scenario finale, è che non puoi usare un ciclo `repeat` con un input (cioè **puoi** usare `repeat() { ... }` ma **non puoi** usare `repeat(10) { ... }`).

Una volta abbattuti tutti gli alieni, vinci! Buona fortuna!
