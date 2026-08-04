---
title: "Volpe geometrica"
description: "Costruisci la faccia geometrica della volpe con triangoli colorati."
en_md5: 095833a5b2117c2d26500103216bf247
---

Questo esercizio ti presenta la funzione `triangle`. Si usa con 7 input. I primi 6 input sono coppie di coordinate per i tre angoli. L'ultimo input è il `color`:

- `x1` (coordinata x del primo angolo), `y1` (coordinata y del primo angolo): il primo punto d'angolo
- `x2` (coordinata x del secondo angolo), `y2` (coordinata y del secondo angolo): il secondo punto d'angolo
- `x3` (coordinata x del terzo angolo), `y3` (coordinata y del terzo angolo): il terzo punto d'angolo
- `color`: il colore del triangolo (ad esempio `"orange"`)

<img src="/static/images/exercise-assets/foxy-face/intro-triangle.webp" alt="Diagramma della funzione triangolo" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

### Disegnare una faccia di volpe

Il tuo compito è usare i triangoli per costruire la faccia geometrica della volpe:

<img src="/static/images/exercise-assets/foxy-face/example.svg" alt="Volpe geometrica" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

La faccia è simmetrica (il lato sinistro è identico al lato destro). Ha 8 triangoli in totale:

- Due guance `"white"`
- Due orecchie `"brown"`
- Due metà della faccia `"orange"`
- Un naso `"charcoal"` (due triangoli)

(Assicurati di usare quei colori quando disegni i triangoli, e ricordati di scriverli come stringhe!)

Abbiamo disegnato i contorni di alcune parti per aiutarti a iniziare. Se segui l'ordine indicato nei commenti, vedrai che tutto risulterà più semplice.

Inoltre, per semplificarti ulteriormente la vita, tutti i numeri usati sono divisibili per 5 (ad esempio `5`, `10`, `15` ecc. sono validi, mentre `1`, `2`, `3`, `4`, `6`, `7`, `8`, `9`, `11` ecc. non lo sono). Incontrerai spesso questo schema negli esercizi successivi.

Un'ultima cosa. Puoi passare il mouse sullo spazio per trovare le coordinate. Ottimo per il lato sinistro, ma dato che il lato destro è simmetrico, riesci a risolverlo senza bisogno di passare il mouse?

Buona fortuna!
