---
title: "Arcobaleno"
description: "Dipingi un arcobaleno fatto di 100 barre verticali colorate."
en_md5: 18cf1d57b1f3683a4484b507528f9acb
---

Il tuo compito è creare un bellissimo arcobaleno formato da 100 barre verticali. Dovrebbe apparire così:

<img src="/static/images/exercise-assets/rainbow/example.webp" alt="Arcobaleno" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

L'arcobaleno è formato da `100` barre, ognuna delle quali va dall'alto verso il basso con una larghezza di `1`. La prima barra deve avere una `x` (la posizione orizzontale) pari a `0`, e l'ultima barra una `x` pari a `99`.

Per impostare il colore, usa la funzione `hsl(...)` (tonalità, saturazione, luminosità). Questa funzione restituisce (_returns_ in inglese) una stringa di colore, che puoi poi usare come ultimo input di `rectangle(...)`. Ti conviene impostare i valori di saturazione e luminosità (_lightness_ in inglese) intorno a `50`. La prima barra deve avere una **tonalità** (_hue_ in inglese) di `0`. La tonalità deve aumentare per ogni barra, fino ad arrivare intorno a 300.
