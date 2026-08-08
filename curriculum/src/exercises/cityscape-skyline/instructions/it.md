---
title: "Skyline"
description: "Costruisci uno skyline urbano di edifici casuali."
en_md5: cb89a31566f55397d19e1375dbac44cc
---

Nell'esercizio Skyscraper hai creato un singolo grattacielo di altezze diverse. Questa volta andiamo oltre: creiamo uno skyline di edifici di altezze e larghezze diverse.

Hai a disposizione la funzione `numBuildings()` (numero di edifici), che ti dice quanti edifici devi creare per quello scenario. Poi hai le funzioni `randomWidth()` (larghezza casuale) e `randomNumFloors()` (numero casuale di piani). Dovrai usarle per determinare la larghezza e il numero di piani di ogni edificio in quello scenario. La prima volta che le usi ti restituiscono i valori per il primo edificio, e così via.

Gli edifici partono con uno spazio di `1` colonna sul lato sinistro, e tra loro c'è uno spazio di `1` colonna.

Quindi, se avessi uno scenario in cui `numBuildings()` restituisce `2`, `randomWidth()` restituisce `5` e poi `7`, e `randomNumFloors()` restituisce `4` e poi `8`, otterresti questa disposizione (dove `xxxxx` rappresenta il pavimento di cemento)

```
       WWWWWWW
       WGGGGGW
       WGGGGGW
       WGGGGGW
 WWWWW WGGGGGW
 WGGGW WGGGGGW
 WGGGW WGGGGGW
 WGGGW WGGGGGW
 WGEGW WGGEGGW
xxxxxxxxxxxxxxxxxxxxxxx
```
