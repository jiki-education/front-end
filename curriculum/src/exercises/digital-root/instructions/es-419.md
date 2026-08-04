---
title: "Raíz digital"
description: "Reduce un número a un solo dígito al sumar sus dígitos una y otra vez."
en_md5: 9847d9ea8c4a86ad65869e4f7b4c718e
---

La raíz digital (_digital root_ en inglés) de un número es lo que obtienes cuando sumas sus dígitos una y otra vez hasta que solo queda un dígito.

Si al sumar los dígitos una vez todavía quedan más de un dígito, sumas los dígitos de _ese_ resultado, y sigues así hasta que quede un solo dígito.

Por ejemplo, para encontrar la raíz digital de `942`:

```
9 + 4 + 2 = 15
1 + 5 = 6
```

Entonces, la raíz digital de `942` es `6`.

Un número que ya es un solo dígito (como `7`) es su propia raíz digital.

Crea una función llamada `digitalRoot` que recibe un número y devuelve su raíz digital.

### La función `String()`

En las últimas lecciones, tuviste acceso a la función `Number(str)`, que convierte un string en un número.

Puedes hacer lo mismo a la inversa, y convertir un número en un string usando la función `String(num)`. Por ejemplo:

```js
String(147) === "147"
```

De nuevo, nota que empieza con mayúscula, ¡y tampoco te preocupes por ahora del porqué!

### Pon en práctica lo que aprendiste

Aunque hay muchas formas de resolver este ejercicio, la solución que queremos que encuentres usa un bucle `while`.

¡Diviértete!
