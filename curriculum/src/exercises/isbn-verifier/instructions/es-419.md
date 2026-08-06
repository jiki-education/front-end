---
title: "Verificador de ISBN"
description: "Revisa si el número ISBN de un libro es válido."
en_md5: 1f50053213b8649f126851f264174e53
---

Cada libro tiene un ISBN: un número de 10 dígitos que lo identifica de manera única. Cada ISBN es único y sigue un formato específico. También hay un proceso formal de verificación para comprobar que un string es un ISBN válido, y eso es lo que vas a crear en este ejercicio.

Los ISBN normalmente contienen guiones y se ven así: `3-598-21508-8`

(También hay ISBN de 13 dígitos, ¡pero puedes ignorarlos para este ejercicio sin problema!)

### Verificar un ISBN

Para verificar un ISBN:

- Empezamos por la izquierda y sumamos cada dígito multiplicado por un peso que va de 10 a 1 en orden descendente.
- Obtenemos el residuo de dividir ese total entre 11.
- Revisamos si ese residuo es cero.

Por ejemplo, para el ISBN `3-598-21508-8`, revisaríamos si:

```
(3*10 + 5*9 + 9*8 + 8*7 + 2*6 + 1*5 + 5*4 + 0*3 + 8*2 + 8*1) % 11 === 0
```

Como el resultado es 0, esto confirma que nuestro ISBN es válido.

Algunas notas importantes más:

- A veces un ISBN puede terminar con una X. Si es el caso, la X representa el valor `10`. Si la X aparece en cualquier otra posición, el ISBN no es válido.
- Los ISBN pueden escribirse con guiones o sin ellos.
- Cualquier otro carácter hace que el ISBN no sea válido.

### Tu tarea

Crea una función llamada `isValidIsbn(isbn)` (verifica si un ISBN es válido) que tome un string ISBN y devuelva `true` si es válido y `false` si no lo es.

### La función Number(...)

Algo que aún no hemos visto, y que necesitas conocer, es la función `Number(str)`. Es una función que toma un string y devuelve ese string como número. Así que si escribes `Number("1234")` obtienes `1234`. Es una función curiosa porque empieza con mayúscula. No te preocupes por eso por ahora: más adelante explicaremos por qué es así.

Aprende más en la <a href="/concepts/type-conversion" target="_blank" rel="noopener noreferrer">página del concepto de Conversión de Tipos</a>.

### Usar lo que acabas de aprender

Como en el ejercicio anterior, aunque hay muchas formas válidas de resolver este ejercicio, la solución que queremos que crees usa una sentencia `continue`.

El escenario adicional te desafía a resolver esto en 22 líneas de código. Hay soluciones más cortas, pero si llegas a 22 líneas, has hecho un buen trabajo de optimización.

¡Diviértete!
