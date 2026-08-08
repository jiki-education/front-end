---
title: "Orologio digitale"
description: "Mostra l'ora corretta su un orologio digitale a 12 ore."
en_md5: e3decc089d371b7113f2657f7571c001
---

In questo esercizio userai due nuove funzioni per ottenere l'ora:

- `currentTimeHour()` (ora attuale): restituisce l'ora attuale nel formato a 24 ore (ad esempio, 15 minuti prima di mezzanotte restituirebbe `23`) come numero.
- `currentTimeMinute()` (minuto attuale): restituisce il minuto attuale come numero.

Il tuo compito è aggiornare un orologio digitale in base ai numeri che queste funzioni restituiscono.

L'orologio digitale si aspetta i numeri nel formato a 12 ore, con `am` o `pm` (il cosiddetto "meridiem").

Ad esempio:

- `7:45` -> `7:45am`
- `19:45` -> `7:45pm`

Per mostrare l'ora sull'orologio usi la funzione `displayTime(hour, minutes, meridiem)` (mostra l'ora).

In ogni scenario l'ora attuale cambia. Il tuo compito è scrivere codice che faccia funzionare tutti gli scenari. Nell'ultimo scenario usiamo l'ora reale, quindi lo scenario cambierà ogni volta che l'ora reale avanza di un minuto!
