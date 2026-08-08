---
title: "Scacchiera"
description: "Disegna una scacchiera di qualsiasi dimensione e preparala per una partita, calcolando ogni posizione a partire dalla dimensione della scacchiera."
en_md5: 1669c45c882ce94e16651bfc2d77a172
---

In questo progetto disegnerai una scacchiera e posizionerai i pezzi, pronti per una partita a dama (conosciuta anche come checkers).

Il tuo codice deve funzionare per **qualsiasi dimensione della scacchiera**. Ti abbiamo fornito tre scacchiere di esempio da provare. Un puzzle usa la classica 8x8, un altro una 6x6 più piccola, un altro ancora una 10x10 più grande. Puoi usare `getBoardSize()` (ottieni la dimensione della scacchiera) per sapere di quanti quadrati è larga ed alta la scacchiera questa volta (le scacchiere sono sempre quadrate).

<div style="display: flex; gap: 8px; margin: 12px 0;">
  <img src="/static/images/exercise-assets/checkerboard/board-6.svg" alt="Scacchiera 6x6" style="width: 33.333%; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);" />
  <img src="/static/images/exercise-assets/checkerboard/board-8.svg" alt="Scacchiera 8x8" style="width: 33.333%; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);" />
  <img src="/static/images/exercise-assets/checkerboard/board-10.svg" alt="Scacchiera 10x10" style="width: 33.333%; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);" />
</div>

### La scacchiera

Come al solito, l'area di disegno è sempre larga `100` ed alta `100`. Segui queste due regole:

- La scacchiera ha un bordo `"black"` attorno al perimetro con uno spessore di `2`.
- I quadrati devono alternarsi tra `"dark brown"` e `"white"`, dividendo in modo ordinato lo spazio all'interno del bordo. Il quadrato in basso a sinistra è sempre di colore `"dark brown"`, mai `"white"`.

### I pezzi

- Ogni pezzo si trova al centro di un quadrato.
- I pezzi sono cerchi con un bordo esterno in rilievo, con un contorno esterno ed un colore interno:
  - Il pezzo intero è largo l'80% del quadrato.
  - Il cerchio interno è largo il 75% del pezzo intero.
- Sulle righe in **alto** della scacchiera si posizionano pezzi `"charcoal"` (ciascuno con un bordo `"black"`).
- Sulle righe in **basso** si posizionano pezzi `"white"` (ciascuno con un bordo `"grey"`).
- I pezzi si trovano esclusivamente sui quadrati **scuri**.
- Le **due righe centrali** sono sempre lasciate vuote. Tutte le altre righe hanno i pezzi.

## Pensa in termini di relazioni

Il cuore di questo esercizio è **non scrivere mai le dimensioni e le posizioni in modo fisso**. Calcola la dimensione di una singola "cella" a partire dalla dimensione della scacchiera, poi costruisci ogni quadrato ed ogni pezzo a partire da essa. Se lo fai correttamente, lo stesso identico codice disegnerà una scacchiera piccola 6x6 ed una più grande 10x10 senza cambiare un solo numero.
