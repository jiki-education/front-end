---
title: "Indicizzazione delle stringhe"
description: "Usare le parentesi quadre e un numero di posizione per estrarre una singola lettera da una stringa. Ricorda che le posizioni partono da zero."
en_md5: cd31e0366b3090b358494667003f54c9
---

Immagina di avere il mio nome, Jeremy, e di voler estrarre la mia iniziale J. Come potremmo farlo?

<img
  class="concept-image"
  src="/static/images/concept-assets/string-indexing/jiki-thinking.webp"
  alt="Jiki che pensa a come estrarre una singola lettera da una stringa"
  width="361"
  height="353"
/>

Beh, puoi pensare a una stringa come a una serie di lettere. Quindi `"Jeremy"` ha sei lettere, J-E-R-E-M-Y, e ognuna ha una posizione. `"J"` è nella prima posizione, `"y"` è nell'ultima posizione.

Ora, in JavaScript e nella maggior parte dei linguaggi di programmazione, queste posizioni partono da zero. Quindi la prima lettera `"J"` è alla posizione zero, e poi abbiamo `"e"` alla posizione uno, `"r"` alla due, `"e"` alla tre, `"m"` alla quattro e `"y"` alla cinque.

Ora, questa cosa di partire da zero è piuttosto strana, e onestamente la vita sarebbe più facile se cominciassimo a contare da uno, come nel mondo normale. Ma non lo facciamo. Nella maggior parte dei linguaggi di programmazione, invece, si comincia a contare da zero, quindi devi solo impararlo.

Quindi, se vogliamo estrarre una lettera in una posizione specifica, possiamo usare le parentesi quadre con il numero all'interno.

Quindi, se scriviamo `"Jeremy"[0]`, stiamo dicendo: dammi la prima lettera della parola `"Jeremy"`.

Se scriviamo `"Jeremy"[1]`, stiamo dicendo: dammi la seconda lettera.

```javascript
"Jeremy"[0] // "J"
"Jeremy"[1] // "e"
```

E possiamo farlo anche con le variabili. Quindi, se creiamo una variabile chiamata `name` (nome) e le assegniamo come valore la stringa `"Jeremy"`, allora possiamo fare `name[0]` e otteniamo di nuovo `"J"`.

```javascript
let name = "Jeremy"
name[0] // "J"
```

Una cosa da chiarire: ciò che ottieni da `name[0]` è semplicemente un'altra stringa. È un altro pezzo di carta con sopra J. Non ha niente di speciale. È una stringa esattamente come `"Jeremy"` è una stringa.

<img
  class="concept-image"
  src="/static/images/concept-assets/string-indexing/jiki-holding-j.webp"
  alt="Jiki che tiene in mano un nuovo pezzo di carta con sopra solo la lettera J"
  width="500"
  height="289"
/>

Semplicemente, ha una lettera sopra invece di sei.

E fare questo non influisce per niente sulla stringa originale. Non stiamo, tipo, strappando via la J o qualcosa del genere. Stiamo solo individuando quale lettera vogliamo, e poi creando una nuova stringa con quella dentro.
