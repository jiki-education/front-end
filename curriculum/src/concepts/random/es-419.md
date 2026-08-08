---
title: "Números aleatorios"
description: "Usar `Math.randomInt` con un mínimo y un máximo para obtener un número diferente cada vez que se ejecuta la función."
en_md5: 5f41de1ca5327be4a86a69d801f1b6f9
---

A menudo, en programación, queremos usar una función y obtener un número aleatorio (_random number_ en inglés) diferente cada vez.

Esto es útil de muchas maneras y en muchos lugares, pero sobre todo en criptografía, donde hacemos muchas cosas como crear códigos para compartir entre máquinas, y esos códigos deben ser aleatorios para que no puedan ser hackeados.

Para ayudarte con esto, tienes disponible una función llamada `Math.randomInt` (donde `Math` significa matemáticas y `randomInt` significa entero aleatorio). Quizá notes que hay un punto en el medio de ese nombre. A medida que tengas acceso a más funciones, podemos organizarlas en distintos grupos para mantener todo ordenado, y la parte de `Math` (abreviatura de matemáticas) es el nombre de un grupo al que pertenece esta función. Le dice a Jiki en qué sección de los estantes buscar, en este caso, la sección `Math`. El punto simplemente significa ve a esta sección y encuentra la función. No te preocupes demasiado por esto por ahora. Las instrucciones del ejercicio siempre te dirán qué funciones están disponibles y cómo usarlas. Lo importante es entender que cuando Jiki usa esta función, le da un número diferente cada vez que la ejecuta, con una restricción. La función tiene dos argumentos. El primero es el número más pequeño que la máquina puede devolver, y el segundo es el número más grande que la máquina puede devolver. Entonces, si usas la función `Math.randomInt` con `10` y `13`, siempre obtendrás `10`, `11`, `12` o `13` de vuelta. Pero obtendrás uno diferente cada vez.

<img
  class="concept-image"
  src="/static/images/concept-assets/random/jiki-shelves-math.webp"
  alt="Jiki subiendo una escalera hacia la sección Math de los estantes de su almacén"
  width="440"
  height="400"
/>

```javascript
Math.randomInt
```

<img
  class="concept-image"
  src="/static/images/concept-assets/random/function-two-inputs.webp"
  alt="La máquina Math.randomInt con dos embudos de entrada en la parte superior"
  width="500"
  height="378"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/random/function-10-13.webp"
  alt="La máquina Math.randomInt con 10 y 13 en sus embudos de entrada, produciendo 10, 11, 12 o 13"
  width="488"
  height="400"
/>

Así que imaginemos que quieres dibujar un círculo en una posición aleatoria en el lienzo. Puedes usar `Math.randomInt` para obtener valores diferentes para `left` y `top` de manera aleatoria cada vez, pero con límites de, por ejemplo, `10` y `90`, para que nunca se superpongan y salgan del lienzo. Cada vez que ejecutas este código, el círculo se dibujará en un lugar ligeramente diferente.
