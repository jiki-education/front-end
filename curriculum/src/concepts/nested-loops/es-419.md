---
title: "Bucles dentro de bucles"
description: "Colocar un bucle dentro de otro para que el bucle interno se ejecute por completo en cada paso del bucle externo, lo que resulta perfecto para cuadrículas."
en_md5: 4ca3e15c1737b6e8cf2f03a56d23a887
---

Digamos que queremos una fila de flores. Podemos escribir algo así: establecemos una posición, plantamos una flor, aumentamos la posición en 10, repetimos y terminamos con una bonita fila ordenada de flores.

```javascript
let x = 10
repeat(5) {
  plant(x, 50, 10)
  x = x + 10
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/nested-loops/single-row-flowers.webp"
  alt="Jiki frente a un pizarrón con una sola fila ordenada de flores plantadas debajo"
  width="406"
  height="400"
/>

Pero ¿y si queremos una cuadrícula de flores con filas y columnas? Quizás cuatro filas con cinco flores en cada una.

<img
  class="concept-image"
  src="/static/images/concept-assets/nested-loops/grid-question.webp"
  alt="Una cuadrícula de cuatro por cinco flores con Jiki pensando en cómo dibujarla"
  width="383"
  height="400"
/>

Tenemos un bucle que dibuja una fila de flores. ¿Cómo puedes usarlo para dibujar cuatro filas? O, ¿qué podríamos hacer para dibujar cuatro filas?

Una opción sería copiar y pegar ese bucle cuatro veces y cambiar la posición superior en cada una. Y eso funcionaría. Estaría bien. Pero es repetitivo y hay una forma mejor. Sabemos que cuando el código es repetitivo, podemos usar un bucle para simplificar las cosas.

Así que aquí podemos usar un bucle dentro de otro bucle: un bucle para las filas y otro para las flores en esa fila. Empecemos agregando un bucle `repeat` alrededor de nuestro código existente para que te hagas una idea. Y vamos a repetir solo una vez. Es decir, le decimos a Jiki que haga todo lo que está dentro de estas llaves externas una sola vez. Esto tiene exactamente el mismo efecto que no tener ese bucle externo en absoluto. Le decimos a Jiki que repita algo una vez, lo que es lo mismo que pedirle que lo haga sin el `repeat`. Pero así funciona este código: es un código válido y legítimo. Tenemos un bucle dentro de otro bucle.

Así que ahora, ¿qué pasa si cambiamos ese bucle externo para que repita dos veces? Entonces Jiki ejecutará dos veces todo eso de `plant` (plantar) cinco veces. Plantará 10 flores. Pero todas esas flores estarán en la misma fila.

De la misma forma que necesitamos mover la posición de izquierda a derecha un poco cada vez, después de dibujar cada fila completa, también necesitamos mover la posición vertical. ¿Cómo lo hacemos? Podemos agregar una variable externa para la posición superior, usarla en nuestra función `plant` y luego aumentarla en 10 después de cada fila.

Piensa en cuál es el valor en cada momento. La posición superior empieza en 10. Durante las primeras cinco veces que plantamos, se queda igual. La posición izquierda aumenta. Luego le sumamos otros 10 a esa posición superior y plantamos cinco flores más un poco más abajo. Volvemos a dejar la posición izquierda en 10 y la aumentamos de nuevo cada vez.

Y ahora podemos decir que se repita esto cuatro veces y obtendremos cuatro filas de cinco plantas.

```javascript
let y = 10
repeat(4) {
  let x = 10
  repeat(5) {
    plant(x, y, 10)
    x = x + 10
  }
  y = y + 10
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/nested-loops/flower-grid-result.webp"
  alt="La cuadrícula terminada de cuatro por cinco flores con Jiki feliz dando dos pulgares arriba"
  width="389"
  height="400"
/>

Lo clave para entender es que Jiki termina todo el trabajo del bucle interno (_inner loop_ en inglés) antes de volver al bucle externo (_outer loop_ en inglés). No va y viene. Completa el bucle interno y luego pasa al siguiente paso del bucle externo.

En esta situación, puedes pensar en el bucle externo como el que controla los grupos o la fila, y en el bucle interno como el que controla cada elemento de ese grupo o de esa fila. En nuestro ejemplo, el bucle externo hace cuatro filas y el bucle interno coloca cinco plantas, cinco elementos en cada grupo.
