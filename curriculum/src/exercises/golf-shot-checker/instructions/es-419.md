---
title: "Verificador de Tiros"
description: "Averigua si un tiro de golf quedó lo suficientemente cerca para embocar."
en_md5: 0585e8c489eca5a11da4df955e647456
---

Bienvenido de nuevo al campo de golf. Hasta ahora solo has estado haciendo rodar la pelota horizontalmente. Cuando llegaba al hoyo, se quedaba justo encima de él. Ahora vamos a animarla para que baje al hoyo.

El primer cambio es que la función `moveTo` (mover a) ahora recibe argumentos para `x` (horizontal) y `y` (vertical). Igual que antes, debes hacerla rodar paso a paso, no solo saltar hasta el final. Pero esta vez, si el golfista mete la pelota en el hoyo, también debes animar esa última parte: mover la pelota hacia abajo para que entre en el hoyo después de que haya llegado al lugar correcto.

Por último, **si la pelota quedó en el hoyo**, una vez que haya rodado hasta el fondo, es momento de celebrar: dispara algunos fuegos artificiales usando la función `fireFireworks()` (disparar fuegos artificiales).

Ten en cuenta esto:

1. La pelota comienza en el tee en `x = 28`, `y = 75`, y rueda paso a paso.
2. Un tiro exitoso significa que la distancia del tiro es `58`, `59`, `60`, `61` o `62`.
3. Debes hacer rodar la pelota hacia abajo `9` unidades.

En este ejercicio, intenta pensar en cada paso con cuidado y ve paso a paso. ¡Buena suerte!
