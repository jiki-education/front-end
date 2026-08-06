---
title: "Iteración sobre strings"
description: "Cómo usar un bucle `for of` para recorrer cada letra de un string y hacer algo con cada una."
en_md5: 584ac0a187a9e5244b84f0fd417494f3
---

Puedes acceder a una sola letra de un string usando corchetes. Ahora vamos a ver cómo recorrer un string, sacando cada letra una por una.

Y para eso necesitamos un nuevo tipo de bucle. Hasta ahora hemos usado el bucle `repeat`, y ahora vamos a usar algo llamado bucle `for of` (que recorre uno a uno los elementos de una colección). Esas son dos palabras clave nuevas, `for` y `of`.

La palabra clave `for` es una que veremos en varios lugares a medida que avancemos. Puede ir sola o acompañada de `in` o de `of`. Por ahora nos vamos a concentrar en esa última, `of`.

Así que veamos algo de código.

Empecemos creando una variable llamada `name` (nombre) y le asignamos el string `"Jeremy"` (el nombre Jeremy). Nada nuevo.

Después tenemos la línea del bucle, y ahí pasan muchas cosas, así que veámosla paso a paso.

```javascript
let name = "Jeremy"
for (let letter of name) {
  // ...
}
```

Primero tenemos la palabra clave `for`. Eso le dice a Jiki que queremos hacer un bucle. Entonces Jiki mira hacia adelante, ve `of` y sabe que queremos hacer un bucle "for of".

Y eso significa que, en lugar de usar un bucle `repeat` donde decimos "recorramos esto 10 veces", estamos diciendo "recorramos todas las letras del string". Eso es lo que significa "for of".

Después tenemos esta parte `let letter` (que crea la variable `letter`). Es exactamente igual que lo que tenemos arriba con `let name`. Simplemente estamos creando una variable llamada `letter`.

La diferencia es que, en lugar de decir explícitamente qué poner dentro, le decimos a Jiki que ponga cada letra del string en la variable, una a la vez.

Entonces Jiki ve `for`, busca el `of` y se pone en marcha. Mira la primera letra del string, `"J"` en este caso, y la pone en una caja nueva llamada `letter`. Por cierto, podríamos llamarla de cualquier forma. No tiene que ser `letter`. Aquí decidimos llamarla `letter`.

Luego ejecuta el código dentro de las llaves, y aquí puedes hacer cualquier cosa que harías en cualquier otro lugar del código. La única diferencia es que este bloque de código se va a ejecutar una vez por cada letra del string, y tendrá disponible esta variable.

Cada vez que Jiki llega a la llave de cierre, descarta la caja `letter` y crea una nueva con la siguiente letra adentro. Así que la primera vez descarta la `"J"` y pone una `"e"` en la caja. Después hace lo mismo con la `"r"`, luego con la `"e"`, la `"m"` y la `"y"`. Seis letras, seis vueltas al bucle. Toma un poco de tiempo acostumbrarse a la sintaxis, pero no es un concepto realmente difícil.

<img
  class="concept-image"
  src="/static/images/concept-assets/string-iteration/jiki-letter-box-loop.webp"
  alt="Jiki descarta la caja vieja de la letra y deja caer la siguiente letra en una caja nueva con la etiqueta `letter`, repitiendo esto para cada letra del string"
  width="500"
  height="168"
/>
