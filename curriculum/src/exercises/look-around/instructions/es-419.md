---
title: "Explora tu entorno"
description: "Crea las funciones que verifican lo que hay a tu alrededor en el laberinto."
en_md5: 9ca44b407519cf6b3d5fa9f3f0e3b3d3
---

La última vez agregaste una nueva función para ayudarte a navegar por el laberinto: `turnAround()` (dar la vuelta). Tenemos tu código a la izquierda para que sigas trabajando en él.

Esta vez hemos quitado tres de las funciones de las que dependías antes. ¡Tu tarea en este ejercicio es implementarlas por tu cuenta!

### Las funciones que tienes que escribir

Las tres funciones que tienes que crear son `canTurnLeft()` (puede girar a la izquierda), `canTurnRight()` (puede girar a la derecha) y `canMove()` (puede moverse).

Ninguna de las funciones recibe argumentos. Todas deben devolver un boolean que indique si es posible moverse en esa dirección.

Para ayudarte, hemos agregado una nueva función `look(direction)` (mirar en una dirección). Esta función recibe un argumento: una dirección que puede ser `"left"`, `"right"` o `"ahead"`. Devuelve uno de los siguientes:

- `"start"` (Donde empiezas)
- `"target"` (A donde quieres llegar)
- `"empty"` (¡El camino libre!)
- `"fire"` (¡Cuidado!)
- `"poop"` (¡Guácala!)
- `"wall"` (¡Auch!)

### Notas para ayudarte

Aquí tienes tres notas que te ayudarán.

1. Una buena práctica en un ejercicio como este es **empezar por crear las funciones** que el código necesita para ejecutarse (es decir, `canTurnLeft()`, `canTurnRight()` y `canMove()`). Ponles un valor de retorno predeterminado que tenga sentido (en este caso, `true` o `false`). Luego puedes implementar la lógica de cada función e ir avanzando poco a poco, en lugar de estar recibiendo constantemente un error porque una función no existe hasta que hayas escrito el programa completo.
2. **No deberías necesitar cambiar nada de tu código existente** para este ejercicio. En vez de eso, agrega las tres funciones al principio del código.
3. Puedes escribir **más funciones** además de las requeridas si te ayuda.
