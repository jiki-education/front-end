---
title: "Desplázate y dispara"
description: "Desplázate por el Space Invaders y elimina a los alienígenas."
en_md5: a238bdc121bdfe425015d2e9e6b872d5
---

Volvemos con Space Invaders. La vez anterior solo necesitabas moverte de izquierda a derecha para derribar a todos los alienígenas. Pero esta vez también tienes que hacer rebotar el láser de izquierda a derecha, haciendo varias pasadas para derribarlos.

Puedes mover el láser a la izquierda y a la derecha usando las funciones `moveLeft()` (mover a la izquierda) y `moveRight()` (mover a la derecha). Puedes experimentar para ver hasta dónde puedes moverte a la izquierda y a la derecha. Si te sales del borde de la pantalla, pierdes.

Como antes, al moverte tienes que comprobar si hay un alienígena encima con la función `isAlienAbove()` (comprobar si hay un alienígena arriba) y, si lo hay, `shoot()` (disparar). Si disparas cuando no hay un alienígena, perderás la partida: ¡desperdiciar munición no está permitido!

El cañón láser se sobrecalienta con facilidad. Tienes que moverlo entre disparos para que se mantenga frío.

Las oleadas se vuelven más intensas a medida que avanzas. En la última oleada los alienígenas reaparecen, así que no hay forma de saber de antemano cuántos disparos necesitarás: tu bucle tiene que seguir ejecutándose hasta que todos los alienígenas hayan desaparecido.

Una regla en este ejercicio, para pasar el escenario final, es que no puedes usar un bucle `repeat` con un argumento (es decir, **puedes** usar `repeat() { ... }` pero **no puedes** usar `repeat(10) { ... }`).

Cuando hayas derribado a todos los alienígenas, ¡ganas! ¡Buena suerte!
