---
title: "Colori HSL"
description: "Costruire colori a partire dalla tonalità (la sfumatura, 0–360), dalla saturazione (quanto è vivido, 0–100) e dalla luminosità (quanto è chiaro, 0–100)."
en_md5: d751e07ccf6b5a58a11d3d2af1026b93
---

HSL ci fornisce un modo completamente diverso di pensare ai colori rispetto a RGB. HSL sta per tonalità (_hue (H)_ in inglese), saturazione (_saturation (S)_ in inglese) e luminosità (_lightness (L)_ in inglese). C'è una funzione chiamata `hsl` che prende tre numeri, uno per la tonalità, uno per la saturazione e uno per la luminosità, e restituisce un colore. Vediamo quindi cosa significano queste tre parole.

```javascript
hsl(hue, saturation, lightness)
```

La tonalità è la sfumatura di colore che desideri, e va da 0 a 360. Puoi immaginare un arcobaleno. Io la penso così. A sinistra abbiamo il rosso, poi l'arancione, il giallo, il verde, il blu, il viola, e in realtà si torna di nuovo al rosso alla fine. Quindi, se dici 0, parti da sinistra e quello è il rosso. Se dici `120`, stai chiedendo il verde. `230` è il blu. Puoi pensarlo anche come una ruota dei colori, ed è questo il senso del 360: è il numero di gradi del cerchio. Io cerco sempre i numeri che mi servono, quindi non preoccuparti troppo di memorizzarli, ma è utile sapere come funziona. Quindi questa è la tonalità, cioè la sfumatura. Poi abbiamo la saturazione, che indica quanto è vivido il colore. Va da 0 a 100. A 0 ottieni solo grigio. Non c'è colore, nessuna tonalità. A 100 ottieni un colore pieno, vivido, vibrante. E poi abbiamo la luminosità. La luminosità indica quanto è luminoso il colore, e anche questa va da 0 a 100. A 0 ottieni il nero. Indipendentemente dalla tonalità scelta, ottieni il nero. Non c'è luce. A 100 ottieni il bianco. Indipendentemente da tutto il resto, è pieno di luce, quindi è bianco. 50 è proprio al centro, il colore normale. Puoi pensarlo come un cursore per rendere il colore più chiaro o più scuro.

<img
  class="concept-image"
  src="/static/images/concept-assets/hsl/hsl-hue-wheel.webp"
  alt="Una ruota dei colori e un arcobaleno che mostrano che 0 è rosso, 120 è verde e 240 è blu"
  width="500"
  height="398"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/hsl/saturation-slider.webp"
  alt="Un cursore di saturazione da 0 (grigio) a 50 fino a 100 (colore pieno e vivido)"
  width="500"
  height="398"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/hsl/lightness-slider.webp"
  alt="Un cursore di luminosità da 0 (nero) a 50 fino a 100 (bianco)"
  width="500"
  height="398"
/>

Quindi, se vogliamo un cerchio rosso normale, che con RGB avremmo scritto come 255, 0, 0, tutto rosso, niente verde, niente blu, qui useremmo 0, 100, 50. 0 per la tonalità rossa, 100 per la saturazione, colore pieno, e 50 per la luminosità, un livello di luminosità normale. Se vogliamo trasformarlo in un cerchio verde, basta cambiare la tonalità in `120`. Se vogliamo un verde più scuro, possiamo ridurre la luminosità a `25`.

```javascript
hsl(0, 100, 50) // red
hsl(120, 100, 50) // green
hsl(120, 100, 25) // dark green
```

Se vogliamo un verde più spento, possiamo togliere un po' di colore, un po' di saturazione, portiamola a `30`.

Se vuoi un rosa acceso, una tonalità di circa 300 è rosa, poi portiamo la saturazione a 100 per renderlo davvero vivace, e aumentiamo anche la luminosità, portiamola a circa 60.

HSL è ottimo quando vuoi scorrere tra i colori. Se vuoi un arcobaleno, puoi semplicemente continuare ad aumentare la tonalità.
