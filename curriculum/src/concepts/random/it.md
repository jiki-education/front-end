---
title: "Numeri casuali"
description: "Usare `Math.randomInt` con un minimo e un massimo per ottenere un numero diverso ogni volta che la funzione viene eseguita."
en_md5: 5f41de1ca5327be4a86a69d801f1b6f9
---

Spesso, nella programmazione, vogliamo usare una funzione per ottenere ogni volta un numero casuale (_random number_ in inglese) diverso.

Questo è utile in tanti modi e contesti, ma specialmente nella crittografia, in cui si creano spesso codici da condividere tra macchine, e questi codici devono essere casuali per non poter essere violati.

Per aiutarti in questo, hai a disposizione una funzione chiamata `Math.randomInt` (dove `Math` sta per matematica e `randomInt` per intero casuale). Noterai che c'è un punto nel mezzo. Man mano che avrai accesso a più funzioni, possiamo organizzarle in gruppi diversi per tenere tutto in ordine, e la parte `Math` (che sta per matematica) è il nome del gruppo a cui appartiene questa funzione. Indica a Jiki in quale sezione degli scaffali guardare, in questo caso la sezione `Math`. Il punto significa semplicemente: vai in questa sezione e trova la funzione. Non preoccuparti troppo di questo per ora. Le istruzioni degli esercizi ti diranno sempre quali funzioni sono disponibili e come usarle. La cosa importante da capire è che quando Jiki usa questa funzione, questa gli restituisce un numero diverso ogni volta che la esegue, con un vincolo. La funzione ha due input. Il primo è il numero più piccolo che la macchina può restituire, e il secondo è il numero più grande che la macchina può restituire. Quindi, se usi la funzione `Math.randomInt` con `10` e `13`, otterrai sempre `10`, `11`, `12` o `13`. Ma ogni volta ne otterrai uno diverso.

<img
  class="concept-image"
  src="/static/images/concept-assets/random/jiki-shelves-math.webp"
  alt="Jiki che si arrampica su una scala fino alla sezione Math dei suoi scaffali del magazzino"
  width="440"
  height="400"
/>

```javascript
Math.randomInt
```

<img
  class="concept-image"
  src="/static/images/concept-assets/random/function-two-inputs.webp"
  alt="La macchina di Math.randomInt con due imbuti di input sulla parte superiore"
  width="500"
  height="378"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/random/function-10-13.webp"
  alt="La macchina di Math.randomInt con 10 e 13 nei suoi imbuti di input, che produce 10, 11, 12 o 13"
  width="488"
  height="400"
/>

Quindi, immaginiamo che tu voglia disegnare un cerchio in una posizione casuale sull'area di disegno. Puoi usare `Math.randomInt` per ottenere valori diversi per `left` e `top` in modo casuale ogni volta, ma con limiti di, diciamo, `10` e `90`, così non si sovrappongono mai e non escono dall'area di disegno. Ogni volta che esegui questo codice, il cerchio verrà disegnato in una posizione leggermente diversa.
