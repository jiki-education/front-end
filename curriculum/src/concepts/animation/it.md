---
title: "Animazione"
description: "Ingannare l'occhio facendogli vedere movimento, ridipingendo lo sfondo e ridisegnando ogni fotogramma in una posizione leggermente nuova."
en_md5: 536994294072afea52dab51d3bb7cab8
---

Finora, quando abbiamo usato il ciclo `repeat` per disegnare cose, ogni nuova cosa che abbiamo disegnato ha aggiunto qualcosa all'immagine. Se abbiamo disegnato un nuovo mattone in un muro, ha riempito uno spazio vuoto. Se abbiamo disegnato 10 cerchi, vediamo 10 cerchi sullo schermo. È come un dipinto. Una volta messa la vernice su un muro, non scompare quando dipingi qualcosa di nuovo accanto. Rimane lì. Ma cosa fare se vogliamo far sembrare che qualcosa si muova?

Hai mai visto un flip book? Erano molto popolari quando ero bambino, ora meno. Un flip book è un libricino in cui ogni pagina ha un disegno leggermente diverso. Sfogliando rapidamente le pagine, i tuoi occhi vedono i disegni cambiare e il tuo cervello pensa che qualcosa si muova. In realtà non si sta muovendo. Sono solo tante immagini leggermente diverse, una dopo l'altra. Ed è esattamente come funziona l'animazione nel codice. Il trucco è lo stesso. Prima di disegnare una nuova scena, dipingiamo su tutta l'area di disegno con un colore di sfondo, un po' come iniziare una nuova pagina del nostro flip book, e poi facciamo un piccolo cambiamento alla scena per farla sembrare in movimento.

<img
  class="concept-image"
  src="/static/images/concept-assets/animation/flip-book-pages.webp"
  alt="Un flip book che mostra una figura stilizzata che corre, ogni pagina leggermente diversa così che la figura sembri muoversi"
  width="500"
  height="274"
/>

Quindi, se prendiamo un blocco di codice familiare in cui disegniamo cerchi sullo schermo, impostiamo una variabile `position` (posizione) e abbiamo un blocco `repeat` in cui disegniamo un cerchio e poi spostiamo `position` di uno a destra. Se eseguiamo quel blocco `repeat` 100 volte, vedremo 100 cerchi sullo schermo.

```javascript
let position = 0
repeat(100) {
  circle(position, 50, 5, "blue")
  position = position + 1
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/animation/circles-trail.webp"
  alt="Una scia di 100 cerchi blu disegnati da sinistra a destra sullo schermo"
  width="500"
  height="197"
/>

Ora guarda cosa succede se aggiungiamo solo un rettangolo semplice prima di disegnare il cerchio ogni volta.

```javascript
let position = 0
repeat(100) {
  rectangle(0, 0, 100, 100, "white")
  circle(position, 50, 5, "blue")
  position = position + 1
}
```

Invece di una scia di cerchi, i nostri occhi vengono ingannati e vedono un unico cerchio che sembra scivolare attraverso lo schermo.

<img
  class="concept-image"
  src="/static/images/concept-assets/animation/circle-glide-frames.webp"
  alt="Una sequenza di fotogrammi, ognuno un'area di disegno bianca fresca con un singolo cerchio blu un passo più a destra"
  width="500"
  height="187"
/>

Ogni volta che eseguiamo il ciclo, dipingiamo uno sfondo completamente nuovo, coprendo tutto ciò che c'era prima, e poi disegniamo il cerchio nella sua nuova posizione.

Ogni passaggio del ciclo è come una nuova pagina del flip book.

E la cosa fondamentale da capire è che non stiamo muovendo il cerchio. Il cerchio non è un oggetto che scivola. È solo un disegno. Ogni volta che eseguiamo il ciclo, dipingiamo sopra il vecchio disegno e ne creiamo uno nuovo di zecca leggermente a destra. Il tuo occhio mette tutto insieme e vede movimento, ma in realtà sono solo tanti disegni separati, uno dopo l'altro.

Puoi usare questa idea per creare un tramonto. Fai muovere il sole, cambia la sua dimensione, cambia il suo colore. È sempre la stessa tecnica. Imposta alcune variabili, dipingi uno sfondo pulito e disegna tutto. Aggiorna le variabili e poi ripeti.
