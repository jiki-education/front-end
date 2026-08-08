---
title: "Procedimientos de batalla"
description: "Extrae tu lógica de disparo en una función reutilizable."
en_md5: 3f2bb9c8622396d8ee591087d949c3de
---

En el nivel anterior, lograste mover un cañón láser de un lado a otro, derribando alienígenas. Trajimos tu solución para que sigas avanzando;

El código anterior funcionaba, pero la lógica de disparo estaba mezclada con todo lo demás. A medida que mejoras en programación, una de las cosas que te ayudarán a tener éxito es dividir tu código en pequeños fragmentos que hagan una sola cosa.

En este ejercicio, necesitas extraer la lógica de disparo en su propia función llamada `shootIfAlienAbove` (dispara si hay un alienígena arriba). Esta función tiene la responsabilidad de revisar si hay un alienígena arriba del cañón láser y, si es así, derribarlo.

El resto de la lógica del juego (seguimiento de posición, cambio de dirección en los límites, movimiento del láser) permanece en el bucle como antes.

Crea tu función `shootIfAlienAbove` y luego úsala dentro del bucle junto con la lógica de movimiento.
