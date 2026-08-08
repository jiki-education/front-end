---
title: "Input di una funzione"
description: "Inserire valori nelle fessure di input di una funzione per cambiare il suo comportamento ogni volta che viene eseguita."
en_md5: 0bd82377f2407de5fe030511752d5503
---

Una delle cose più potenti delle macchine, cioè delle funzioni, è che molte di esse ti permettono di inserire delle informazioni al loro interno e, quando le esegui, cambiano ciò che fanno.

Finora abbiamo visto macchine che assomigliano un po' a delle scatole, come quella di `move` (muovi).

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-inputs/move-machine.webp"
  alt="La macchina `move`, una semplice scatola senza fessure di input"
  width="322"
  height="400"
/>

Ma alcune macchine hanno delle fessure, come questa macchina `walk` (cammina). La macchina `walk` è esattamente come la macchina `move`. Fa avanzare il personaggio (_character_ in inglese), con la differenza che Jiki può usare la fessura per specificare quanti passi deve fare il tuo personaggio. Quindi, invece di dover usare la funzione `move` tre volte di fila: `move`, `move`, `move`, ora puoi semplicemente usare la funzione `walk` e dire a Jiki di mettere il numero tre nella macchina.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-inputs/walk-machine-slot.webp"
  alt="La macchina `walk`, con una fessura di input in cima per il numero di passi"
  width="481"
  height="400"
/>

Per fare questo nel codice, scriviamo comunque il nome della funzione, in questo caso `walk`, e mettiamo la parentesi di apertura. Poi, prima della parentesi di chiusura, specifichiamo quale vogliamo che sia l'input. In questo caso, vogliamo che l'input sia tre, per dire `walk` di fare tre passi in avanti:

```javascript
walk(3)
```

Quando Jiki lo vede, prende il numero tre (puoi pensare a quel numero come a una monetina) e lo inserisce nella fessura di input della macchina prima di girare la manovella per caricarla.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-inputs/jiki-coin-into-slot.webp"
  alt="Jiki che lascia cadere il numero 3 come una monetina nella fessura della macchina `walk`, poi gira la manovella per caricarla"
  width="421"
  height="400"
/>

Per le funzioni che disegnano rettangoli e cerchi, devi dire a Jiki di inserire più numeri diversi, specificando cose come la distanza da sinistra (`left`), la distanza dall'alto (`top`), la larghezza di un rettangolo (`width`), l'altezza di un rettangolo (`height`).

Nel mondo di Jiki, queste sono solo fessure diverse, una per ciascuno di quei numeri.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-inputs/two-machines-inputs.webp"
  alt="La macchina del rettangolo con le fessure per left, top, width, height, e la macchina del cerchio con le fessure per cx, cy, radius"
  width="396"
  height="400"
/>

Quindi, nel nostro codice, scriviamo semplicemente ogni numero e poi mettiamo una virgola tra uno e l'altro. Il nome della funzione, una parentesi, un numero per ciascun input, tutti separati da virgole, e poi chiudiamo la parentesi:

```javascript
rectangle(10, 20, 30, 40)
```

Se provi a usare una funzione con il numero sbagliato di input, riceverai un errore. Per esempio, se provi a mettere un input in una macchina che non ha fessure, Jiki ti dirà che non puoi farlo. E se provi a usare una macchina che ha una fessura di input ma non dici a Jiki cosa metterci, anche in quel caso si fermerà e si lamenterà. Prova, se ti senti un po' ribelle, e guarda cosa succede. Farai molti errori di questo tipo man mano che le cose diventano più complicate. Cerca di non stressarti o di non arrabbiarti. Impariamo tutti sbagliando. È letteralmente il modo più veloce per il nostro cervello di interiorizzare davvero le cose. E tutti fanno questi errori. Siamo partiti tutti da zero, quindi non ti stressare.

Un'altra cosa che vale la pena menzionare: a volte negli esercizi vedrai delle righe che iniziano con due barre oblique, `//`. Queste si chiamano commenti (_comments_ in inglese). Sono note private solo per te che Jiki ignorerà completamente. Quindi, se Jiki vede una riga che inizia con queste due barre, la salta semplicemente e passa alla riga successiva. I commenti ti danno un modo per scrivere appunti personali. Sono molto utili per ricordarti come funzionano le cose. Spesso i commenti vengono scritti anche per te, in modo che quando inizi un esercizio possano suggerirti dove scrivere il codice o come risolvere qualcosa. Ma sentiti libero di aggiungere anche i tuoi commenti.

In fondo alle istruzioni di un esercizio, vedrai le informazioni sulle funzioni che puoi usare, con l'elenco preciso degli input che devi inserire.
