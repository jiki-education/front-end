---
title: "Actualizar variables"
description: "Cambiar lo que hay dentro de una variable mientras tu programa se ejecuta para que puedas seguir posiciones, cuentas, puntuaciones y otros valores cambiantes."
en_md5: f9b2fbb6bfd82a620b093e88951ff841
---

Hasta ahora, cuando hemos creado variables, hemos puesto valores en cajas y luego los hemos sacado más tarde. Eso ha sido muy útil para dar claridad a nuestro código y para reducir algunos de los cálculos mentales que de otra forma habríamos tenido que hacer. Pero el verdadero valor de las variables viene de la capacidad de cambiar lo que hay en una caja, lo que hay en la variable, a lo largo de un programa. Así que, aunque ejecutemos el mismo fragmento de código varias veces, lo que hace puede cambiar según lo que haya dentro de las cajas.

Supongamos que queremos plantar una flor en un jardín. Tenemos una práctica función `plant` (plantar) que recibe un solo argumento: la posición donde queremos colocar la flor. Entonces, si queremos colocar una flor a 10 del borde, lo escribimos así:

```javascript
plant(10)
```

<img
  class="concept-image"
  src="/static/images/concept-assets/updating-variables/flowers-same-spot.webp"
  alt="Una flor plantada en un jardín junto al pizarrón de Jiki"
  width="406"
  height="400"
/>

¿Y si queremos plantar ocho flores? Bueno, podríamos escribir `plant(10)`, `plant(20)`, `plant(30)`, etcétera, pero eso es bastante tedioso.

Y ya hemos aprendido algo que nos ayuda a reemplazar este tipo de código tedioso. ¡Usa un bucle! ¡Usa un bloque `repeat`! Así que pongamos la posición en 10 y luego tengamos un bloque `repeat` donde llamamos a `plant`, usamos la función `plant`, ocho veces.

```javascript
let position = 10
repeat(8) {
  plant(position)
}
```

¿Qué crees que va a pasar?

Bueno, va a plantar ocho flores, pero las va a plantar en el mismo lugar cada vez, que no es realmente lo que queremos. Así que tomémonos un momento para pensar qué está haciendo Jiki aquí. Está creando una caja con la etiqueta position. Le pone 10. Después, ejecuta la máquina `plant` ocho veces. Cada vez, saca el valor de la caja de posición. Siempre es 10, y cada vez vuelve a poner el mismo 10.

<img
  class="concept-image"
  src="/static/images/concept-assets/updating-variables/jiki-loop-walkthrough.webp"
  alt="Jiki tomando la caja de posición del estante y pasando su valor 10 a la máquina plant"
  width="400"
  height="400"
/>

Así que lo que necesitamos es una manera de avanzar un poco cada vez. Después de plantar una flor, queremos decirle a Jiki que avance la posición 10, lista para plantar la siguiente flor.

Entonces, olvidando el código por un momento, ¿cómo sería hacer eso lógicamente? Si te digo: «Planta la primera flor en 10, después la siguiente en 20, después la siguiente en 30», ¿cómo sabe tu cerebro que la siguiente debería plantarse en 40 y la que sigue en 50?

Lo que hace tu cerebro es llevar la cuenta del número actual, sumarle 10 y luego actualizar ese número en tu mente.

Y podemos hacer exactamente lo mismo en código. Para hacer esto, decimos: «actualizar (_update_ en inglés) la caja de posición para que tenga el valor actual de la posición más 10».

Cuando Jiki ve esto, saca el número actual de la caja de posición, le suma 10, hace el cálculo (los suma) y luego coloca el resultado de vuelta en la caja para la próxima vez.

```javascript
position = position + 10
```

<img
  class="concept-image"
  src="/static/images/concept-assets/updating-variables/jiki-updating-box.webp"
  alt="Jiki sacando 10 de la caja de posición, sumando 10 para obtener 20 y volviendo a poner 20 en la caja"
  width="427"
  height="400"
/>

Entonces, si añadimos esto a nuestro programa, de manera que ahora digamos: «Establece el valor inicial de la posición en 10», luego, ocho veces, planta una flor en la posición, y después cambia la posición para que sea 10 mayor que antes, nuestro código funciona y obtenemos ocho flores espaciadas.

Fíjate que no hay `let` (declarar) cuando actualizamos la variable. Esto es muy importante. Cuando Jiki ve `let`, crea una caja nueva. Pero aquí no queremos crear una caja nueva. Queremos cambiar lo que hay dentro de la caja que ya tenemos.

También nota que solo creamos la caja una vez, fuera del bucle. Es importante recordarlo. Crea la caja una vez al principio y luego actualízala cada vez que se ejecute el bucle.

Podemos actualizar lo que hay en las cajas, y podemos usar ese poder para seguirle la pista a algo que cambia con el tiempo. Vas a usar este patrón constantemente: seguir una posición, contar cuántas veces ha pasado algo, llevar la puntuación. Siempre que necesites recordar algo que cambia mientras tu programa se ejecuta, esta es la manera de hacerlo.
