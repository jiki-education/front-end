---
title: "Fiesta de nombre de nicho"
description: "Averigua quién puede entrar a una fiesta muy exclusiva."
en_md5: 3c03097aed9465c8f132574b033ad7ce
---

¡La fiesta de esta noche es muy exclusiva: solo pueden entrar las personas cuyo nombre empiece con una secuencia específica de letras!

Tu trabajo es escribir una función llamada `handleGuest` (manejar al invitado) que recibe dos argumentos:

- `name` - el nombre de la persona en la puerta
- `allowedPrefix` - las letras iniciales que se requieren para la fiesta de esta noche

Debe devolver `true` si la persona puede entrar, y `false` si debe ser rechazada.

Por ejemplo:

- Si el prefijo de esta noche es `"S"`, entonces Sarah entra (devuelve `true`) pero Brad no (devuelve `false`).
- Si el prefijo permitido es `"Brad"`, entonces Brad y Bradley entran, pero Brian no.

### Funciones auxiliares

A medida que avances en este ejercicio, te darás cuenta de que necesitas calcular la longitud del nombre del invitado y también la longitud del prefijo permitido. Esta es la oportunidad perfecta para crear una función auxiliar llamada `getLength(someString)`, que cuenta cuántas letras hay en el string. Luego puedes usar esta función en diferentes lugares dentro de `handleGuest(...)`.

El escenario adicional te reta a resolver esto con la menor cantidad de líneas posible. También puedes pensar en otras soluciones que te gusten más, que usen más líneas. No pasa nada (y te animamos a explorar diferentes enfoques), pero intenta encontrar también la versión más corta.

¡Diviértete!
