---
title: "Tessuto a Righe"
description: "Tessi un motivo a righe scegliendo il colore corretto per ogni striscia."
en_md5: ba93b39f1883d50139d243a16e3c204f
---

Stai progettando un algoritmo per creare un rotolo di tessuto a righe, che dovrebbe apparire così:

<svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="Venti strisce verticali: viola alle estremità, con strisce verdi, blu e gialle in mezzo." style="width: 200px; height: 200px; display: block; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;padding:4px;margin-top:-8px">
  <rect x="0" y="0" width="5" height="100" fill="#A020F0" />
  <rect x="5" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="10" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="15" y="0" width="5" height="100" fill="#008000" />
  <rect x="20" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="25" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="30" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="35" y="0" width="5" height="100" fill="#008000" />
  <rect x="40" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="45" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="50" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="55" y="0" width="5" height="100" fill="#008000" />
  <rect x="60" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="65" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="70" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="75" y="0" width="5" height="100" fill="#008000" />
  <rect x="80" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="85" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="90" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="95" y="0" width="5" height="100" fill="#A020F0" />
</svg>

Il motivo è una sequenza ripetuta di `"yellow"`, `"blue"`, `"yellow"`, `"green"`. La prima e l'ultima striscia sono `"purple"`.

L'area di disegno è larga `100` e alta `100`. Devi disegnare `20` strisce, ognuna larga `5`.

### Regole dell'esercizio

Non puoi risolvere questo esercizio scrivendo semplicemente 20 istruzioni `rectangle(...)`. Il tuo codice deve funzionare per qualsiasi dimensione del tessuto. Infatti, puoi usare la funzione `rectangle(...)` (rettangolo) una sola volta nel tuo codice!

Invece, devi creare un ciclo e utilizzare l'operatore resto (_remainder_ in inglese) che abbiamo visto nell'ultima lezione video. Pensa bene all'ordine delle istruzioni: è la chiave per riuscire in questo esercizio.

Prenditi il tuo tempo e divertiti!
