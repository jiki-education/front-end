---
title: "Cicli annidati"
description: "Inserire un ciclo dentro un altro, in modo che il ciclo interno venga eseguito completamente per ogni passo del ciclo esterno: è perfetto per le griglie."
en_md5: 4ca3e15c1737b6e8cf2f03a56d23a887
---

Mettiamo di volere una fila di fiori. Possiamo scrivere qualcosa del genere. Impostiamo una posizione, piantiamo un fiore, aumentiamo la posizione di 10, ripetiamo, e otteniamo una bella fila ordinata di fiori.

```javascript
let x = 10
repeat(5) {
  plant(x, 50, 10)
  x = x + 10
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/nested-loops/single-row-flowers.webp"
  alt="Jiki alla lavagna con un'unica fila ordinata di fiori piantati sotto"
  width="406"
  height="400"
/>

Ma cosa succede se vogliamo una griglia di fiori con righe e colonne? Magari quattro righe con cinque fiori ciascuna.

<img
  class="concept-image"
  src="/static/images/concept-assets/nested-loops/grid-question.webp"
  alt="Una griglia di fiori quattro per cinque con Jiki che pensa a come disegnarla"
  width="383"
  height="400"
/>

Abbiamo un ciclo che disegna una fila di fiori. Come puoi usarlo per disegnare quattro file? O cosa potremmo fare per disegnare quattro file?

Un'opzione potrebbe essere copiare e incollare quel ciclo quattro volte e cambiare la posizione verticale per ognuna. E funzionerebbe. Andrebbe bene. Ma è ripetitivo, e c'è un modo migliore. Sappiamo che quando il codice è ripetitivo, possiamo usare un ciclo per semplificare le cose.

Quindi qui possiamo usare un ciclo dentro un altro ciclo. Un ciclo per le righe e uno per i fiori su quella riga. Allora, iniziamo aggiungendo un ciclo `repeat` attorno al nostro codice esistente, così puoi prendere confidenza con questa idea. E lo faremo ripetere solo una volta. Stiamo dicendo a Jiki di fare tutto ciò che è all'interno di queste parentesi graffe esterne una sola volta. Questo ha esattamente lo stesso effetto che non avere questo ciclo esterno. Stiamo dicendo a Jiki di ripetere qualcosa una volta, che è lo stesso che dirgli di farlo senza il `repeat`. Ma è così che funziona questo codice. È un codice legittimo, valido. Abbiamo un ciclo dentro un altro ciclo.

Adesso cosa succede se cambiamo quel ciclo esterno in modo che ripeta due volte? Allora Jiki eseguirà l'intera faccenda di `plant` (pianta) ripetuta cinque volte due volte. Pianterà 10 fiori. Ma tutti quei fiori saranno sulla stessa riga.

Quindi, nello stesso modo in cui dobbiamo spostare la posizione da sinistra a destra un po' ogni volta, dopo aver disegnato ogni riga completa, dobbiamo anche spostare la posizione verticale. Allora come facciamo? Beh, possiamo aggiungere una variabile esterna per la posizione verticale, usarla nella nostra funzione `plant`, e poi aumentarla di 10 dopo ogni riga.

Allora, pensa a qual è il valore in ogni momento. La posizione verticale parte da 10. Per le prime cinque volte che piantiamo, rimane così. La posizione orizzontale aumenta. Poi aggiungiamo altri 10 a quella posizione verticale, e piantiamo altri cinque fiori un po' più in basso. Reimpostiamo la posizione orizzontale di nuovo a 10, e poi la aumentiamo di nuovo ogni volta.

E adesso possiamo dire di ripetere tutto quattro volte, e otterremo quattro file da cinque piante ciascuna.

```javascript
let y = 10
repeat(4) {
  let x = 10
  repeat(5) {
    plant(x, y, 10)
    x = x + 10
  }
  y = y + 10
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/nested-loops/flower-grid-result.webp"
  alt="La griglia di fiori quattro per cinque completata, con un Jiki felice che fa due pollici in su"
  width="389"
  height="400"
/>

La cosa fondamentale da capire è che Jiki porta a termine tutto il lavoro nel ciclo interno (_inner loop_ in inglese) prima di tornare al ciclo esterno (_outer loop_ in inglese). Non sta saltando avanti e indietro. Completa il ciclo interno, poi passa al passo successivo del ciclo esterno.

In questa situazione, puoi pensare al ciclo esterno come a chi controlla i gruppi o la riga, e al ciclo interno come a chi controlla ogni elemento di quel gruppo o ogni elemento di quella riga. Quindi, nel nostro esempio, il ciclo esterno crea quattro righe, e il ciclo interno mette cinque piante, cinque elementi in ogni gruppo.
