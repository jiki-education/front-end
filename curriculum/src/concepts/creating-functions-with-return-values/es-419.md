---
title: "Agregando devoluciones a las funciones"
description: "Usar la palabra clave `return` para dar a tus funciones una rampa de salida que entregue un valor de vuelta a quien la llama."
en_md5: 51d31f709a7051c29b499a31ad68555e
---

Ya sabes cómo crear funciones con y sin argumentos. Queda una última cosa por aprender, y luego serás un experto en hacer funciones: cómo darle a tus funciones una rampa de salida.

Ya has usado muchas funciones que devuelven cosas. `isAlienAbove` (hay un alien arriba) te devuelve `true` o `false`. `Math.randomInt(1, 10)` (Math significa matemáticas; randomInt significa entero aleatorio) te devuelve un número al azar.

Cuando Jiki usa esas funciones, algo sale disparado por la rampa de salida, y luego él puede ir y usarlo.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-return-values/output-chute.webp"
  alt="Jiki recogiendo un valor mientras sale de la rampa de salida de una máquina"
  width="500"
  height="312"
/>

Así que para hacer esto, necesitamos otra palabra clave nueva, y es la palabra clave `return`.

La palabra clave `return` le dice a Mini Jiki que empuje algo fuera de la rampa de salida.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-return-values/return-keyword-push.webp"
  alt="Mini Jiki dentro de la máquina empujando el valor 42 hacia afuera por la rampa de salida"
  width="500"
  height="335"
/>

Así que vamos a crear una función, y la vamos a llamar `meaningOfLife` (significado de la vida), y el trabajo de esta función siempre es simplemente devolver el número `42`. No tiene argumentos. La escribimos así:

```javascript
function meaningOfLife() {
  return 42
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-return-values/meaning-of-life-42.webp"
  alt="La máquina meaningOfLife enviando el número 42 por su rampa de salida"
  width="500"
  height="323"
/>

Ahora, en cualquier lugar donde usemos `meaningOfLife()` en nuestro código, obtenemos el número `42` de vuelta para usarlo como cualquier otro valor. Podemos ponerlo en una caja con `let`, podemos pasarlo como argumento a otra función, podemos compararlo en un condicional.

Las funciones con devolución también pueden aceptar argumentos. Podrías escribir una función `ageBracket(age)` (rango de edad) que devuelva `"Sorry, too young"` cuando `age` es menor a 18, y `"Welcome"` en caso contrario. Quien la llame recibe de vuelta el string que la función haya devuelto.

```javascript
function ageBracket(age) {
  if (age >= 18) {
    return "Welcome"
  }
  return "Sorry, too young"
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-return-values/age-input.webp"
  alt="Un valor de edad cayendo en la ranura de entrada de la máquina para que pueda decidir qué devolver"
  width="487"
  height="400"
/>

Así es como funciona la programación en esencia. Creamos muchos de estos pequeños bloques de construcción y luego los unimos para armar programas.
