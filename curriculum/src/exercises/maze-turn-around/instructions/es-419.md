---
title: "Dar la vuelta"
description: "Crea una función para dar la vuelta en el laberinto."
en_md5: bbb03498f3b5ec9956af463e85fde414
---

En el ejercicio anterior descubriste cómo resolver el laberinto automáticamente. ¡Buen trabajo!

Una de las cosas buenas de la solución es que el código se lee de forma muy natural. Está muy alineado con el algoritmo. Excepto por una parte...

¿Te resultó un poco insatisfactorio tener que usar `turnLeft()` (girar a la izquierda) dos veces para dar la vuelta, en vez de tener una función `turnAround()` (dar la vuelta)?

¡Bueno, esta es tu oportunidad para solucionarlo!

Crea una nueva función llamada `turnAround` al inicio de tu código. No recibe argumentos y no devuelve nada. Simplemente debe llamar a `turnLeft()` dos veces.

Luego usa esa función en la solución, en la última sentencia `else`.

Intenta que tu programa final completo tenga 17 líneas de código.
