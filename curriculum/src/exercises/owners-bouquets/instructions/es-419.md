---
title: "Ramos del dueño"
description: "Planta flores en diferentes diseños de jardín."
en_md5: bdb2a772a6549db0226a6c17326f20c6
---

Te damos la bienvenida a tu segundo ejercicio con escenarios.

Volvemos con nuestra máquina de jardinería automatizada. Antes siempre plantábamos 9 flores, pero ahora las cosas están cambiando. Necesitamos que nuestro robot pueda plantar la cantidad de flores que le indique el dueño de la casa.

Para esto tenemos una función llamada `askNumberOfFlowers()` (preguntar el número de flores). Cuando la usamos, le preguntamos al dueño de la casa cuántas flores plantar y la función devuelve un número con la respuesta. Si la función devuelve 3, tenemos que plantar 3 flores. Si devuelve 8, tenemos que plantar 8 flores.

Tenemos instrucciones estrictas de mantener el jardín ordenado, así que necesitamos plantar las flores de manera uniforme por todo el jardín. Si hay 3 flores, tenemos que plantarlas en las posiciones 25, 50 y 75. Si hay 4 flores, tenemos que plantarlas en las posiciones 20, 40, 60 y 80, etc. (Como siempre, el jardín tiene 100 unidades de ancho).

### Escenarios

Como en el ejercicio de golf que acabas de resolver, a la izquierda verás cuatro puntos grises para los cuatro escenarios distintos. **Al hacer clic en cada punto** se muestra un escenario distinto, pero esta vez es `askNumberOfFlowers()` la que devolverá un número diferente cada vez.

Tu tarea es escribir un solo programa que funcione para todos los valores distintos que `askNumberOfFlowers()` pueda devolver.

¡Buena suerte!
