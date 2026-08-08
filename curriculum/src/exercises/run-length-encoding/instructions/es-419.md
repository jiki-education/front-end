---
title: "Codificación por longitud de rachas"
description: "Comprime y descomprime texto contando rachas de caracteres repetidos."
en_md5: a176be7e6ed782e9aa4b54a4575f751f
---

La codificación por longitud de rachas (_run-length encoding_ en inglés) es una forma simple de compresión. Las rachas de un mismo carácter repetido seguidamente se reemplazan por un número seguido de ese único carácter. Los caracteres que aparecen una sola vez se dejan como están, sin ningún número delante.

Por ejemplo, `"AABBBCCCC"` se codifica como `"2A3B4C"`, y `"XYZ"` (sin repeticiones) se codifica simplemente como `"XYZ"`.

El espacio en blanco cuenta como un carácter como cualquier otro, así que `"  hsqq qww  "` se codifica como `"2 hs2q q2w2 "`.

### Dos funciones

Escribe dos funciones:

- `encode` (codificar) toma un string y devuelve su forma codificada por longitud de rachas.
- `decode` (decodificar) toma un string codificado y devuelve el texto original.

Decodificar invierte el proceso: un número te dice cuántas veces debes repetir el carácter que le sigue. Recuerda que una racha puede tener más de 9 caracteres, así que un número puede tener más de un dígito (por ejemplo, `"12W"` significa doce `W`s).

### Poner en práctica lo aprendido

Aunque hay muchas formas de resolver este ejercicio, la solución que queremos que logres utiliza el tipo de bucle `for` que aprendiste en el último video. Revisa los conceptos al final si necesitas un recordatorio de la sintaxis, ¡porque es bastante fea!

¡Diviértete!
