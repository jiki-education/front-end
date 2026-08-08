---
title: "Sonidos de gotas de lluvia"
description: "Convierte números en sonidos de gotas de lluvia: Pling, Plang y Plong."
en_md5: 93b85e63b3d48e4e7f6d249592b367a1
---

Raindrops es una versión del clásico desafío FizzBuzz que se ha usado en entrevistas de programación desde siempre.

Tu tarea es convertir un número en sus correspondientes sonidos de gotas de lluvia.

Hacemos esto viendo entre qué números es divisible el número (por ejemplo, el número 10 es divisible entre 1, 2, 5 y 10. El número 12 es divisible entre 1, 2, 3, 4, 6 y 12).

Si el número dado:

- es divisible entre 3, añade "Pling" al resultado.
- es divisible entre 5, añade "Plang" al resultado.
- es divisible entre 7, añade "Plong" al resultado.
- no es divisible entre 3, 5, ni 7, el resultado debe ser el número como string.

Debes crear una función llamada `raindrops(num)` (gotas de lluvia) que tome el número como argumento y devuelva sus sonidos de gotas de lluvia.

Construye la cadena de resultado usando concatenación (_concatenation_ en inglés) (`+`) o una plantilla de cadena (_template string_ en inglés).

### Ejemplos

- `raindrops(28)` devuelve "Plong" porque 28 es divisible entre 7, pero no entre 3 ni 5.
- `raindrops(30)` devuelve "PlingPlang" porque 30 es divisible entre 3 y 5, pero no entre 7.
- `raindrops(34)` devuelve "34" porque 34 no es divisible entre 3, 5, ni 7.
