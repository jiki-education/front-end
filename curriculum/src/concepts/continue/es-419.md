---
title: "Continue"
description: "Uso de la palabra clave `continue` dentro de un bucle para omitir el resto de esta iteración y saltar directamente a la siguiente iteración."
en_md5: 6c3f7483826e27d44d6c404cc9f621dd
---

Hay ocasiones en las que queremos omitir una iteración específica de un bucle en lugar de salir de él. Imagina que solo queremos hacer cosas para los números impares.

Queremos poder decir: si `i` (el contador) es impar, no ejecutes el bucle esta vez.

Pero no queremos salir del todo del bucle. Solo queremos omitir esta única iteración y luego pasar a la siguiente.

Y para esto, tenemos otra palabra clave llamada `continue`.

Cuando Jiki ve `continue`, simplemente salta de vuelta al principio del bucle para la siguiente iteración. Así que en un bucle for-of, si ve `continue`, pasa al siguiente elemento de la lista.

```javascript
for (let item of list) {
  if (item === "something") {
    continue; // Omite el resto del bucle si el elemento es "something"
  }
  // Resto del bucle...
}
```

En un bucle for, Jiki realiza el incremento de `i++` y luego comienza la siguiente iteración.

```javascript
for (let i = 0; i < 10; i++) {
  if (i % 2 === 0) {
    continue; // Omite el resto del bucle para los números pares
  }
  // Resto del bucle...
}
```
