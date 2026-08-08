---
title: "Dopo la festa"
description: "Scopri quanti ospiti una celebrità può portare con sé, usando due liste allineate."
en_md5: c31c0988af324530b986262f47d9a745
---

Siamo di nuovo nei panni di un buttafuori. Ma questa volta abbiamo a che fare con celebrità di serie A all'After Party.

Quando queste persone si presentano alla tua festa, si aspettano che tu le conosca solo per nome. Brad Pitt non sprecherà fiato a dirti il cognome: dirà solo «Brad» e poi ti guarderà come se fossi tu quello impacciato.

Stasera sul tuo blocco degli appunti ci sono due liste. La prima è `names`, i nomi completi di tutti gli invitati. La seconda è `plusOnes`, quante persone extra ciascun invitato è autorizzato a portare con sé (i loro _plus-ones_ in inglese). Le due liste sono state scritte insieme, voce per voce, nello stesso ordine, in modo che siano allineate. Per esempio, la terza voce della lista dei nomi corrisponde alla stessa persona della terza voce della lista `plusOnes`.

Scrivi una funzione chiamata `plusOnesFor` (ospiti aggiuntivi per). La funzione ha tre input: la lista `names`, la lista `plusOnes` e il **nome** di chi ti sta davanti in questo momento. Devi restituire il numero di ospiti extra che quella persona è autorizzata a portare con sé.

Fai attenzione, però. Si sta formando una coda, e queste persone non fanno la fila in silenzio. «Brad» significa Brad Pitt, non Bradley Cooper. E uno o due di loro sono abbastanza famosi da aver abbandonato del tutto il cognome.

Alcuni invitati sono presenti nella lista ma non possono portare nessuno con sé, quindi `0` è una risposta perfettamente valida per un nome che è sulla lista. Chi non è affatto sulla lista è tutta un'altra storia: per loro devi restituire la stringa `"Not on the list!"`, esattamente come scritto.

### Metodi e proprietà degli array

Come le stringhe, anche gli array hanno metodi e proprietà. In questo esercizio potresti usare la proprietà `.length`. Funziona esattamente come la versione per le stringhe, solo che ora ti dice quanti elementi ci sono nell'array, invece di quante lettere ci sono nella stringa. Per esempio:

```js
["Jeremy", "Erik", "Aron"].length
// 3
```

Divertiti!
