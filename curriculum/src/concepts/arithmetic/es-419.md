---
title: "Aritmética"
description: "Combinar variables con matemáticas para que los valores se relacionen y dependan unos de otros mediante sumas, restas, multiplicaciones y divisiones."
en_md5: 7ce54754a3ca29896609a01a51b12377
---

Hasta ahora, al crear variables solo hemos usado valores simples: un número como `50` o un string como `"yellow"`. Las variables se vuelven mucho más potentes cuando las combinamos entre sí. Por ejemplo, podemos decir que el borde izquierdo de un rectángulo esté a cierta distancia del borde del lienzo.

En programación, podemos usar matemáticas básicas comunes, como sumar, restar, multiplicar y dividir, y podemos usar las variables que ya definimos como parte de eso.

Empecemos por decir que queremos dibujar un rectángulo en nuestro lienzo, y queremos que empiece a 10 de distancia desde la izquierda y desde la derecha, y a 20 desde arriba y desde abajo. Así que va a quedar en el medio del lienzo, un poco más ancho que alto.

<img
  class="concept-image"
  src="/static/images/concept-assets/arithmetic/rectangle-on-canvas.webp"
  alt="Un rectángulo azul centrado en el lienzo, a 10 de los bordes izquierdo y derecho y a 20 de los bordes superior e inferior"
  width="399"
  height="400"
/>

Cuando dibujamos un rectángulo, necesitamos saber su `left` (izquierda), `top` (superior), `width` (ancho) y `height` (altura), además de su color. Así que podemos empezar escribiendo eso.

Ahora necesitamos calcular cuánto deberían valer `left`, `top`, `width` y `height`. Así que asignémoslos. `left` es 10. `top` es 20. El `width`, bueno, el `width` es el tamaño del lienzo, que es 100, menos los 10 de la izquierda y los 10 de la derecha, así que es 80. Y el `height` es la altura del lienzo, que también es 100, menos los 20 de arriba y los 20 de abajo, o sea 60.

```javascript
let left = 10
let top = 20
let width = 80
let height = 60

rectangle(left, top, width, height, "blue")
```

Entonces podemos definir esas variables. `left`, 10; `top`, 20; `width`, 80; `height`, 60. Pero, ¿qué pasa si queremos mover un poco el rectángulo, hacerlo más chico? ¿Si queremos que quede a 20 de los bordes izquierdo y derecho y a 30 de arriba y abajo? Tendríamos que volver a calcular todo. El `width` ahora sería 100 menos 20 menos 20, y el `height` 100 menos 30 menos 30, y definitivamente es más trabajo y más matemáticas de lo que quiero hacer. En lugar de eso, podemos decirle a la computadora que lo haga por nosotros.

Podemos hacer que `width` sea 100 menos `left` menos `left`, y `height` sea 100 menos `top` menos `top`, porque el margen de arriba y el de abajo son iguales. O podríamos escribirlo como 100 menos `left` por dos, o 100 menos `top` por dos.

```javascript
let width = 100 - left * 2
let height = 100 - top * 2
```

Ahora, si cambiamos `left` o `top`, `width` y `height` también cambiarán. Las cosas empiezan a relacionarse entre sí. ¿Y el lienzo? Por ahora vale 100. Pero, ¿qué pasa si el lienzo cambia a 200 de ancho y de alto? Bueno, probablemente convenga crear una variable llamada `canvasSize` (tamaño del lienzo) y ponerle 100. Entonces `width` sería `canvasSize` menos `left` por dos, y `height` sería `canvasSize` menos `top` por dos.

```javascript
let canvasSize = 100
let left = 20
let top = 30
let width = canvasSize - left * 2 // 60
let height = canvasSize - top * 2 // 40

rectangle(left, top, width, height, "blue")
```

Pensemos en lo que hace Jiki cuando escribimos `let height = canvasSize - top * 2`. Bueno, empieza tomando la caja `top` del estante, encuentra un 30 adentro, saca su calculadora de bolsillo, multiplica 30 por dos y mentalmente anota 60.

<img
  class="concept-image"
  src="/static/images/concept-assets/arithmetic/flow-of-images-1.webp"
  alt="Jiki tomando la caja top del estante y calculando que 30 por dos es 60"
  width="377"
  height="400"
/>

Después, toma la caja `canvasSize` del estante, encuentra 100 adentro y calcula que 100 menos 60 es 40. Ahora sabe que en realidad lo que estamos diciendo es que `height` valga 40. Así que obedece el `let`, agarra una caja nueva, le escribe `height` encima y mete un 40 adentro. Más tarde, cuando usa `height`, simplemente vuelve a sacar el 40.

<img
  class="concept-image"
  src="/static/images/concept-assets/arithmetic/flow-of-images-3.webp"
  alt="Jiki agarrando una caja nueva, escribiéndole height encima y metiendo un 40 adentro"
  width="462"
  height="400"
/>

Cuando tengas todo funcionando en un ejercicio, prueba a cambiar los valores de las variables y mira qué pasa. Observa cómo crecen y cómo se achican. Tómate tu tiempo, piensa en las relaciones entre las cosas.
