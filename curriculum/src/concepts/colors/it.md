---
title: "Colori"
description: "Due modi per specificare qualsiasi colore desideri. RGB mescola luce rossa, verde e blu. HSL usa tonalità, saturazione e luminosità."
en_md5: a0eea0481b975e45f75774d83966a4a7
---

Se mai farai qualcosa di visuale con il codice (e anche se vuoi fare il data scientist e pensi che tutta la roba di disegno sia un po' noiosa, comunicare dati attraverso le immagini è una competenza fondamentale) ci sono due modi diversi per esprimere i colori. Hai già usato i colori con i loro nomi come red o yellow come ultimo input nelle tue funzioni di disegno, ed è stato un bel modo per usare i colori rapidamente, ma è piuttosto limitante. Ci sono solo una manciata di colori con nome che possiamo usare. Quindi adesso vedremo due modi per esprimere qualsiasi colore tu voglia, e questi due si chiamano RGB e HSL.

RGB ci permette di pensare ai colori come a una miscela di rosso, verde e blu. Questo è ciò che RGB significa: rosso (_red (R)_ in inglese), verde (_green (G)_ in inglese), blu (_blue (B)_ in inglese). Se ti ricordi di aver mescolato i colori a scuola, l'idea è simile, solo che invece di mescolare vernice, mescoliamo luce.

In molti esercizi, avrai una funzione chiamata `rgb`, e prenderà tre numeri come input, uno per il rosso, uno per il verde, uno per il blu, e restituirà un colore.

I numeri che puoi usare come input vanno da zero a `255`. Zero significa che non voglio niente di quel colore, e `255` significa mescolare più di quel colore possibile. Quindi se usiamo la funzione `rgb` con `255`, zero e zero come input, stiamo dicendo che vogliamo tutto il rosso. Ricorda che `255` è il numero più grande che puoi mettere lì dentro. Ma non vogliamo verde né blu, quindi quelli sono entrambi zero. Quindi otteniamo rosso, e possiamo memorizzare quel rosso in una variabile e poi usarlo nella funzione `circle` proprio come abbiamo già fatto con le stringhe con nome. E se usiamo la funzione `rgb` con zero, `255`, zero? Ora stiamo dicendo niente rosso, tutto il verde, niente blu. Quindi otteniamo un cerchio verde. E se vogliamo il giallo? Il giallo è una miscela di rosso e verde. Quindi possiamo dire dammi tutto il rosso, tutto il verde e niente blu, e questo ci darà il giallo. E possiamo usare numeri più piccoli. Quindi se vogliamo un po' di rosso, niente verde e tanto blu, otterremo il viola. E tanto rosso, un po' di verde, un po' più di blu, ci dà un rosa. Ecco RGB. Mescoliamo rosso, verde e blu per ottenere combinazioni diverse.

<img
  class="concept-image"
  src="/static/images/concept-assets/colors/rgb-intro.webp"
  alt="Tre cerchi sovrapposti di luce rossa, verde e blu che si mescolano per creare giallo, magenta, ciano e bianco"
  width="500"
  height="390"
/>

```javascript
let red = rgb(255, 0, 0)
let green = rgb(0, 255, 0)
let yellow = rgb(255, 255, 0)
let pink = rgb(230, 50, 170)
```

Ora vediamo HSL, che ci dà un modo completamente diverso di pensare ai colori. HSL sta per tonalità (_hue (H)_ in inglese), saturazione (_saturation (S)_ in inglese) e luminosità (_lightness (L)_ in inglese). E in modo simile a RGB, hai una funzione chiamata `hsl` che prende tre numeri, uno per la tonalità, uno per la saturazione e uno per la luminosità, e restituirà un colore. Quindi vediamo cosa significano queste tre parole.

La tonalità è la sfumatura di colore che desideri, e va da zero fino a 360. Forse immagina un arcobaleno. Ecco come ci penso io. A sinistra abbiamo il rosso, e poi abbiamo arancione, giallo, verde, blu, viola, e in realtà torniamo fino al rosso. Quindi se dici zero, inizi a sinistra, ed è rosso. Se dici `120`, stai chiedendo il verde. `230` è il blu. Puoi anche pensarlo come una ruota dei colori (_color wheel_ in inglese), che è ciò che rappresentano i 360. È il numero di gradi in un cerchio. Io guardo sempre i numeri che mi servono, quindi non preoccuparti troppo di cercare di memorizzarli, ma è bello sapere cosa succede. Quindi ecco la tonalità, cioè la sfumatura (_shade_ in inglese). Poi abbiamo la saturazione, che indica quanto è vivido il colore. Va da zero a 100. A zero, ottieni solo grigio. Non c'è colore, nessun tono. A 100, ottieni un colore pieno, vivido, vibrante. E poi abbiamo la luminosità. La luminosità indica quanto è chiaro il colore, e anche questa va da zero a 100. A zero ottieni il nero. Indipendentemente dalla tonalità scelta, ottieni il nero. Non c'è luce. E a 100 ottieni il bianco. Indipendentemente da tutto il resto, è pieno di luce, quindi è bianco. 50 è esattamente nel mezzo, il colore normale. Quindi puoi pensarlo come uno slider per rendere il colore più chiaro o più scuro.

<img
  class="concept-image"
  src="/static/images/concept-assets/colors/hsl-intro.webp"
  alt="Un arcobaleno e una ruota dei colori che mostrano la tonalità che va da 0 (rosso) a 120 (verde) a 240 (blu)"
  width="500"
  height="398"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/colors/saturation-slider.webp"
  alt="Slider della saturazione da 0 (grigio) passando per 50 fino a 100 (magenta vivido)"
  width="500"
  height="398"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/colors/lightness-slider.webp"
  alt="Slider della luminosità da 0 (nero) passando per 50 (colore pieno) fino a 100 (bianco)"
  width="500"
  height="398"
/>

Quindi se vogliamo un cerchio rosso normale, che avremmo scritto come 255, zero, zero con RGB, tutto il rosso, niente verde, niente blu, qui useremmo zero, 100, 50. Zero per la tonalità rossa, 100 per la saturazione, colore pieno, e 50 per la luminosità, che è un livello di luminosità normale. Se vogliamo renderlo un cerchio verde, possiamo semplicemente cambiare quella tonalità a `120`. Se vogliamo renderlo un verde più scuro, possiamo ridurre la luminosità a `25`.

Se vogliamo renderlo un verde più spento, possiamo togliere un po' di colore, un po' di saturazione, diciamo portarla a `30`.

Se vuoi un rosa acceso e brillante, una tonalità di circa 300 è il rosa, e poi alziamo la saturazione a 100 per renderlo davvero vivido, e aumentiamo anche la luminosità a circa 60.

```javascript
let red = hsl(0, 100, 50)
let green = hsl(120, 100, 50)
let darkGreen = hsl(120, 100, 25)
let dullGreen = hsl(120, 30, 50)
let hotPink = hsl(300, 100, 60)
```

Quindi abbiamo due modi diversi per esprimere un colore, e sono utili in situazioni diverse. RGB è ottimo quando vuoi regolare una componente specifica, quanto rosso, quanto verde, quanto blu. HSL è ottimo quando vuoi scorrere tra i colori. Se vuoi un arcobaleno, puoi semplicemente continuare ad aumentare la tonalità.
