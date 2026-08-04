---
title: "Luhn"
description: "Valida números de identificación como los de las tarjetas de crédito usando la suma de verificación de Luhn."
en_md5: 07b0aea3adc2353e50a26e5cbe5cd162
---

Acabamos de ver cómo validar los números ISBN de los libros. Hay otra fórmula común que se usa para verificar números en muchos contextos: la fórmula de Luhn (_Luhn formula_ en inglés). Se usa sobre todo para detectar errores en los números de las tarjetas de crédito.

### La verificación de Luhn

La verificación de Luhn tiene varios pasos:

- Empezando por el dígito más a la **derecha** y moviéndonos hacia la izquierda, **duplica el valor de cada segundo dígito**.
- Si al duplicar un dígito obtienes un número mayor que 9, réstale 9.
- Después suma todos los dígitos.
- Si el total es divisible exactamente por 10, el número es válido.

Por ejemplo, con `"067"` seguimos estos pasos:

```
0   6   7     // dígitos originales
0  12   7     // cada segundo dígito (de la derecha) duplicado
0   3   7     // 12 es mayor que 9, así que restamos 9 → 3
       10     // Sumamos los dígitos
     true     // 10 es divisible por 10, así que 067 es válido
```

### Tu tarea

Crea una función llamada `valid` (válido) que reciba una cadena y devuelva `true` si pasa la verificación de Luhn y `false` si no la pasa.

Los números se pasan como cadenas y pueden contener espacios para que se lean mejor (por ejemplo `"4539 1488 0343 6467"`). Los espacios se deben ignorar.

Ten en cuenta lo siguiente:

- La entrada puede contener espacios; debes ignorarlos.
- Si la entrada contiene cualquier otro carácter, debes devolver `false`.
- Las cadenas de longitud 1 o menor (una vez quitados los espacios) **no** son válidas.

### Poner en práctica lo aprendido

Aunque hay muchas formas de resolver este ejercicio, la solución que queremos que elabores usa un bucle `for`.

También necesitarás la función <a href="/concepts/type-conversion" target="_blank" rel="noopener noreferrer">`Number(str)`</a> que presentamos en el ejercicio anterior.

¡Diviértete!
