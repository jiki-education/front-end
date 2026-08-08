---
title: "Pelota Arcoíris"
description: "Construye una pelota que rebota y pinta un rastro arcoíris a lo largo del lienzo."
en_md5: 501aa30e85d8fceb38890c72be4a0b87
---

Tu tarea es crear una pelota que rebote al azar por el lienzo, dibujando un arcoíris a su paso.

Debería verse más o menos así:

<img src="/static/images/exercise-assets/rainbow-ball/example.gif" alt="Pelota arcoíris animada rebotando por el lienzo y dejando un rastro de colores" style="width: 100%; max-width: 200px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

Como parte de este ejercicio, tienes la función `Math.randomInt(min, max)` (que devuelve un número entero aleatorio entre el `min` y el `max` que le des).

Tómate unos minutos para pensar cómo podrías resolverlo. Esta es la parte más valiosa del ejercicio, así que tómate tu tiempo y **anota tus ideas antes de leer la fórmula que está más abajo.**

Cuando tengas una idea de tu enfoque, sigue leyendo. ¡Pero no leas más hasta que hayas dedicado tiempo a pensar!

## La fórmula

Este proyecto consiste en tener algunas variables que se encargan de la posición de la pelota, las cuales aumentan o disminuyen de forma constante. Y otras variables que controlan **cómo** se mueve la pelota y cambian cuando se cumplen ciertos criterios.

### Dibujar

- El primer círculo que dibujes debe estar en `(5, 5)`.
- Todos los círculos deben tener un radio de `10`.
- El color del círculo debe usar HSL, comenzando con un tono de `100` (verde), una saturación de `80` (colores intensos) y una luminosidad de `50` (brillo medio).

### Animar

- Para empezar, en cada iteración debes mover la pelota `2` a la derecha y `1` hacia abajo.
- El tono debe aumentar en `1` cada vez, hasta llegar al máximo (`360`), y luego empezar a disminuir. La saturación y la luminosidad no necesitan cambiar.

### Rebotar

- Una vez que la pelota llegue al borde del lienzo, debe cambiar de dirección. (Revisa las pistas si no logras averiguar cómo hacerlo.)
- Para hacerlo más divertido, debes cambiar la dirección usando la función `Math.randomInt(min, max)`. Elige `min` (mínimo) y `max` (máximo) que den el estilo de animación que quieras.

## Para aprobar las verificaciones

Te hemos dado bastante libertad en este ejercicio. Verificamos que:

- Los primeros círculos sean correctos.
- Más del 80% del lienzo quede pintado.

Los números que elijas para lograrlo son cosa tuya. Probablemente quieras un bloque `repeat` que itere entre `500` y `1000` veces.

## Divídelo en pasos…

La clave de este ejercicio es hacer las cosas de una en una:

1. Haz que la pelota cambie de color mientras se mueve.
2. Haz que rebote en el lado derecho.
3. Haz que rebote en la parte inferior.
4. Haz que rebote aleatoriamente.
