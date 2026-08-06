---
title: "Space Invaders: Condicional"
description: "Solo dispara cuando haya un alien en la mira."
en_md5: 4a603e339af722e912ab2ff9b25cc287
---

Los aliens cambiaron de formación. Ahora están organizados en dos filas, pero no todas las columnas tienen un alien.

Tienes tres funciones:

- `move()` (mover) mueve tu cañón láser una posición a la derecha
- `shoot()` (disparar) dispara el láser hacia arriba
- `isAlienAbove()` (verifica si hay un alien arriba) devuelve `true` si hay un alien encima de ti, o `false` si no

¡No dispares si no hay ningún alien encima de ti, o pierdes!
