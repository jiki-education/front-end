---
title: "Metodi"
description: "Funzioni che appartengono a un valore e vengono chiamate con la notazione con il punto, come `\"Jeremy\".includes(\"e\")` o `\"Jeremy\".toUpperCase()`."
en_md5: 37c097a81459cd2ff4ae684559bd4311
---

Finora, quando abbiamo pensato alle stringhe o ai numeri, li abbiamo considerati come cose piuttosto statiche.

E anche se lo sono, hanno anche molte funzionalità incorporate che Jiki può usare.

E man mano che andiamo avanti, impareremo queste funzionalità, queste specie di capacità che hanno e che ti semplificano la vita.

Ci sono due tipi di capacità che vedremo: proprietà e metodi.

I metodi sono funzioni che appartengono alla stringa.

Quindi, invece di scrivere una funzione a cui passiamo una stringa come input, possiamo usare un metodo direttamente sulla stringa.

Per esempio, ricordi una funzione con cui controlli se una stringa contiene una lettera particolare al suo interno? Beh, le stringhe hanno in realtà un metodo chiamato `includes` (contiene) che fa proprio questo, e possiamo usarlo con la stessa sintassi con il punto che hai visto per le proprietà.

La differenza rispetto alle proprietà è che quando li scriviamo, li scriviamo come funzioni, con parentesi e input.

Quindi possiamo scrivere:

```javascript
"Jeremy".includes("e") // true
```

E otterremo `true`, perché `"Jeremy"` contiene una `"e"`.

<img
  class="concept-image"
  src="/static/images/concept-assets/methods/jiki-writing-jeremy.webp"
  alt="Jiki che scrive la stringa Jeremy su un pezzo di carta"
  width="359"
  height="400"
/>

I metodi sono diversi dalle proprietà perché non sono fatti statici. Sono in realtà funzioni. Puoi considerarli come funzioni che hanno una scatola incorporata con la stringa all'interno.

Come funzionano non importa per ora. Non dovrai costruirli per un po'. Tutto quello che devi sapere è che usi un metodo mettendo un punto e poi la normale sintassi delle funzioni.

Una cosa da sapere sulle stringhe è che i metodi non cambiano nulla all'interno della stringa. Per esempio, esiste un metodo `toUpperCase` (in maiuscolo) che restituisce la stringa con tutte le lettere in maiuscolo. Ma questo non cambia la stringa originale. Quella contiene ancora `"Jeremy"` scritto con la sola J maiuscola. Invece, Jiki crea una nuova stringa tutta in maiuscolo.

```javascript
const name = "Jeremy"
const bigName = name.toUpperCase()

log(bigName) // "JEREMY"
log(name) // "Jeremy"
```
