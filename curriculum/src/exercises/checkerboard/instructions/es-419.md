---
title: "Tablero de damas"
description: "Dibuja un tablero de damas de cualquier tamaño y coloca las fichas para una partida, derivando cada posición a partir del tamaño del tablero."
en_md5: 1669c45c882ce94e16651bfc2d77a172
---

En este proyecto dibujarás un tablero de damas y colocarás las fichas, listo para una partida de damas (también conocido como checkers).

Tu código debe funcionar para **cualquier tamaño de tablero**. Te damos tres tableros de muestra para que los pruebes. Un rompecabezas usa el tablero clásico de 8x8, otro uno más pequeño de 6x6, y otro uno más grande de 10x10. Puedes usar `getBoardSize()` (obtener el tamaño del tablero) para averiguar cuántos cuadros de ancho y alto tiene el tablero esta vez (los tableros siempre son cuadrados).

<div style="display: flex; gap: 8px; margin: 12px 0;">
  <img src="/static/images/exercise-assets/checkerboard/board-6.svg" alt="Tablero de damas de 6x6" style="width: 33.333%; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);" />
  <img src="/static/images/exercise-assets/checkerboard/board-8.svg" alt="Tablero de damas de 8x8" style="width: 33.333%; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);" />
  <img src="/static/images/exercise-assets/checkerboard/board-10.svg" alt="Tablero de damas de 10x10" style="width: 33.333%; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);" />
</div>

### El tablero

Como de costumbre, el lienzo siempre tiene `100` de ancho y `100` de altura. Sigue estas dos reglas:

- El tablero tiene un borde `"black"` alrededor del contorno con un ancho de `2`.
- Los cuadrados deben alternar entre `"dark brown"` y `"white"`, repartiéndose el espacio dentro del borde de manera ordenada. El cuadrado de abajo a la izquierda siempre es marrón oscuro, no blanco.

### Las fichas

- Cada ficha se ubica en el centro de un cuadrado.
- Las fichas son círculos con relieve, con un borde exterior y un color interior:
  - La ficha completa tiene un ancho del 80% del cuadrado.
  - El círculo interior tiene un ancho del 75% de la ficha completa.
- Las filas de la parte **superior** del tablero llevan fichas `"charcoal"` (cada una con un aro `"black"`).
- Las filas de la parte **inferior** llevan fichas `"white"` (cada una con un aro `"grey"`).
- Las fichas solo van sobre los cuadrados **oscuros**.
- Las **dos filas del medio** se dejan siempre vacías. Todas las demás filas llevan fichas.

## Piensa de manera relacional

La clave de este ejercicio es **nunca codificar de forma fija** los tamaños y posiciones. Calcula un único tamaño de "celda" a partir del tamaño del tablero y después construye cada cuadrado y cada ficha a partir de él. Si lo haces bien, el mismo código dibujará un tablero pequeño de 6×6 y uno más grande de 10×10 sin cambiar un solo número.
