---
title: "Resuelve el laberinto con código"
description: "Escribe código que recorra cualquier laberinto por sí mismo."
en_md5: d3f3c0d2727632fe7872d07e1c2cd99a
---

En el primer ejercicio de laberinto movías manualmente a tu personaje por el laberinto. ¡Ahora estás listo para resolver cualquier laberinto con código!

Para hacerlo posible, tienes tres funciones nuevas:

- `canTurnLeft()` (puede girar a la izquierda): devuelve `true` si el espacio a la izquierda del personaje no es una pared.
- `canTurnRight()` (puede girar a la derecha): devuelve `true` si el espacio a la derecha del personaje no es una pared.
- `canMove()` (puede avanzar): devuelve `true` si el espacio frente al personaje no es una pared.

Al combinar esas funciones con `move()` (avanzar), `turnLeft()` (girar a la izquierda) y `turnRight()` (girar a la derecha) que ya tenías, es posible escribir un algoritmo para resolver **cualquier** laberinto. «Algoritmo» es una palabra elegante que simplemente significa «una manera de hacer algo». Es como una fórmula o una receta.

Más abajo en las instrucciones, te diré el algoritmo para que lo resuelvas. Pero quiero que primero intentes deducirlo por ti mismo como un pequeño acertijo de lógica. Si sabes si puedes girar a la izquierda, a la derecha o avanzar, ¿cómo puedes resolver cualquier laberinto que te dé?

Una vez que lo tengas, o te hayas rendido, desplázate hacia abajo para ver la respuesta y lo que necesitas escribir en código.

<hr style="border-top: 1px solid var(--color-gray-200); margin:40px 0"/>

### El algoritmo

Bien, eso fue un pedido difícil, así que imagino que quizás tuviste algunas ideas pero no la solución completa. Estos son los pasos que debes seguir:

- Si puedes girar a la izquierda, gira a la izquierda y avanza.
- Si no, si puedes avanzar, avanza.
- Si no, si puedes girar a la derecha, gira a la derecha y avanza.
- Si no, date la vuelta.

¡Si haces eso, puedes resolver cualquier laberinto!

Escribe esas instrucciones en código. ¡Diviértete!
