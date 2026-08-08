---
title: "Gli array"
description: "Una catena ordinata di elementi (stringhe, numeri, booleani o qualsiasi altra cosa) tenuti insieme come un unico valore che Jiki può passare da un posto all'altro."
en_md5: d26ccb9e04fbc77129f3199d63a95017
---

Finora hai usato numeri, stringhe e booleani, la parola elegante per dire true e false, e chiamiamo queste categorie tipi di dati (_data types_ in inglese). Adesso aggiungiamo il nostro primo tipo di dati composto (_compound data type_ in inglese).

Si tratta di un tipo di dati che può contenere più cose, non una sola, e questo tipo di dati si chiama array.

Quando senti la parola array, voglio che pensi a una catena fisica che tiene insieme tante cose.

Le cose che tiene insieme possono essere qualsiasi cosa: stringhe, numeri, booleani, perfino altri array, perfino cose che non hai ancora imparato, ma per ora non preoccupartene.

Tutto in questa catena è in ordine, l'ordine in cui le cose sono concatenate.

Quindi un array contiene tante cose, ma è un unico elemento, un'unica cosa: un solo array con tanti elementi al suo interno.

Jiki può prendere quell'array, quella catena, e metterla in una scatola, proprio come può mettere in una scatola una stringa o un numero.

Può infilarlo nella fessura di una macchina. Può tirarlo fuori da uno scivolo. Questo array è una cosa sola, e Jiki lo usa esattamente come usa le stringhe, i numeri e tutto il resto che hai visto finora.

Ora, nel codice, anche un array assomiglia un po' a una catena. Ha una parentesi quadra a ogni estremità e poi tanti elementi concatenati, separati da virgole.

Per esempio, se volessimo creare un array con i nomi di alcuni dei nostri mentori, potremmo preparare una scatola chiamata `mentors` (mentori) e metterci dentro quella catena.

Scriveremmo `let mentors =`, esattamente come facciamo con qualsiasi altra scatola, e poi una parentesi quadra aperta, tanti elementi, i loro nomi separati da virgole, e infine una parentesi quadra chiusa. Quando Jiki vede questo codice, va a prendere quattro pezzi di carta, uno per ogni nome, poi prende una catena nuova, li concatena tutti insieme e mette quella catena nella scatola `mentors`.

In un array puoi mettere qualsiasi cosa: stringhe, numeri, booleani, perfino un misto di cose.

Questi sono tutti esempi di array perfettamente validi.

Puoi anche creare un array vuoto. È solo una catena senza elementi. È comunque una cosa reale. Ha ancora entrambe le estremità. È ancora una catena. Semplicemente non ha niente al suo interno. Ma puoi comunque mettere questo array vuoto in una scatola, tirarlo fuori e usarlo più tardi.

Quindi puoi creare un array con la sintassi delle parentesi quadre, ma come si usano davvero? Come controlliamo cosa c'è dentro e come tiriamo fuori le cose? Esattamente come abbiamo fatto quando volevamo estrarre le lettere da una stringa: possiamo usare la sintassi delle parentesi quadre con dei numeri all'interno.

Torniamo quindi al nostro array di mentori. Se vogliamo tirare fuori il primo, scriviamo `mentors[0]`. Ricorda che in JavaScript si conta da zero.

E possiamo anche scorrere un array esattamente come abbiamo scorso le stringhe, usando `for-of`.

Gli array funzionano esattamente allo stesso modo. L'unica differenza è che questa volta, invece di ottenere una lettera, otteniamo l'elemento che si trova nell'array. In questo esempio, il nome del mentore.

Così la prima volta che ringraziamo qualcuno, ringraziamo `"DJ"`. La seconda volta ringraziamo `"Becky"`, e così via.

Possiamo anche usare la proprietà `length` sugli array, proprio come abbiamo imparato con le stringhe. Se nella scatola `mentors` c'è un array con quattro stringhe e scriviamo `mentors.length`, restituirà quattro.

E anche `includes` funziona esattamente allo stesso modo sugli array. Possiamo scrivere `mentors.includes("DJ")` e restituirà `true`. Ma se scriviamo `mentors.includes("Frank")`, restituirà `false`.

Tutto funziona esattamente come con le stringhe. È solo che stiamo lavorando con gli elementi di un array, non con le lettere di una stringa.
