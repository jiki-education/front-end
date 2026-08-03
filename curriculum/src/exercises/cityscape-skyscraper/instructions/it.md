---
title: "Grattacielo"
description: "Costruisci un grattacielo sulla griglia della città."
en_md5: 901851ded0ac8a0ef6cb80db60e59998
---

Questo è il primo di due esercizi in cui costruirai dei grattacieli.

In questo esercizio, il tuo compito è costruire un singolo grattacielo al centro della scena. In ogni scenario l'altezza del grattacielo varia.

Per capire quanti piani costruire, hai a disposizione la funzione `numFloors()` (il numero di piani) che restituisce l'altezza totale dell'edificio.

Ci sono tre diversi componenti che puoi usare: muro (`W`), vetro (`G`) e ingresso (`E`). Dai un'occhiata alle funzioni qui sotto per vedere quelle che creano questi elementi.

Il piano più vicino al suolo (che a seconda della geografia si chiama «piano terra» o «primo piano»!) ha sempre un ingresso incastrato tra due segmenti di vetro e due segmenti di muro esterni (`WGEGW`). Gli altri piani hanno tre segmenti di vetro incastrati con segmenti di muro (`WGGGW`). E sopra i piani c'è un tetto (`WWWWW`).

Quindi un grattacielo di 5 piani ha un piano con l'ingresso, 4 piani di vetro e un tetto. Dovrebbe apparire così:

```
WWWWW
WGGGW
WGGGW
WGGGW
WGGGW
WGEGW
```

Il centro del grattacielo deve trovarsi alla colonna `19`. Il piano terra parte da `2` (appena sopra il pavimento di cemento) e sale verso l'alto (quindi nel nostro esempio, il piano con l'ingresso si trova a `2` e il tetto a `7`).

Una regola fondamentale di questo esercizio è che tutti i valori che inserisci nelle funzioni devono essere variabili o formule. Non puoi inserire direttamente un numero come `20`.

Una volta completato questo esercizio, sbloccherai un Progetto in cui costruirai interi skyline cittadini con edifici in numero e larghezza variabili.
