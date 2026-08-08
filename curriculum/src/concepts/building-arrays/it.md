---
title: "Costruire array"
description: "Partire con un array vuoto e usare `push` per aggiungere elementi uno alla volta mentre scorri i dati."
en_md5: c3358ca032f965cf058bb72df37ffbd4
---

Fino ad ora hai lavorato con array il cui valore viene fissato all'inizio e resta invariato. Ma cosa succede se vuoi aggiungere elementi a un array nel tempo? Beh, per farlo, gli array hanno un metodo chiamato `push` (aggiungi).

Push ha un solo input: l'elemento che vuoi attaccare in fondo all'array. Quindi, in questo caso, vogliamo aggiungere la parola `"Isaac"` in coda all'array che contiene già `"DJ"` e `"Bethany"`, usando `push`.

Per farlo, Jiki tira fuori l'array dalla scatola, attacca `"Isaac"` alla fine della catena e poi rimette il tutto nella scatola. Nota che, a differenza di quanto accadeva con le stringhe, dove Jiki creava ogni volta una nuova stringa, qui sta effettivamente modificando l'array.

Un pattern che vedrai spesso nella programmazione è partire con un array vuoto e costruirlo man mano. Puoi immaginare di avere una grande lista di nomi e di volerla scorrere. Ogni volta che troviamo un nome che è un mentore, lo aggiungiamo all'array.

Questo schema di ciclo e aggiunta lo userai spesso.
