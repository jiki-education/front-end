---
title: "Funciones que devuelven cosas"
description: "Atrapar un valor que sale de la rampa de salida de una función y usarlo en tu código."
en_md5: 830f19fb6aaf184c1f32ade792b60a12
---

Hasta ahora hemos visto funciones que hacen algo en el mundo. Así que la función `circle` (círculo) dibuja un círculo. La función `move` (mover) mueve a tu personaje. Pero algunas funciones funcionan de manera diferente. En lugar de hacer algo externo, te dan algo de vuelta que puedes usar dentro de tu código. Cuando una función le entrega algo a Jiki para usarlo en el código, decimos que la función devuelve (_returning_ en inglés) algo. Le devuelve algo a Jiki. Puedes pensar en estas máquinas como si tuvieran una rampa de salida. Ya tenemos nuestras ranuras de entrada donde metemos cosas, pero también podemos tener una única ranura de salida o una rampa por la que algo puede salir de vuelta. Cuando Jiki presiona el botón de la máquina, la máquina empieza a funcionar y algo saldrá de esa rampa al final. Puede ser un número. Puede ser un string. Es algo que Jiki puede atrapar y usar.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-return-values/machine-with-return-chute.webp"
  alt="Una máquina con una rampa de salida en un costado, lista para enviar un valor de vuelta a Jiki"
  width="500"
  height="317"
/>

La mayoría de las funciones, probablemente el 95 %, devuelven algo. Pueden hacer algunas operaciones matemáticas por ti y devolver el valor, o pueden pegar algunos strings entre sí y luego darte el string resultante. O quizás te devuelven la hora actual cada vez que ejecutas esa máquina. Veamos este último caso. Supongamos que tenemos una función llamada `getCurrentTime` (obtener hora actual). Cada vez que Jiki ejecuta la máquina, un trozo de papel sale por la rampa de salida con la hora escrita, quizás 14:35.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-return-values/paper-out-of-chute.webp"
  alt="La máquina getCurrentTime con un trozo de papel que dice 14:35 deslizándose por su rampa de salida"
  width="500"
  height="312"
/>

Y luego podemos poner ese valor devuelto en una caja usando `let`:

```javascript
let time = getCurrentTime()
```

Jiki ejecutará la máquina, obtendrá la hora actual de la rampa y la guardará en una caja llamada `time`.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-return-values/jiki-boxing-time.webp"
  alt="Jiki colocando el papel con 14:35 de la rampa en una caja etiquetada con time"
  width="372"
  height="400"
/>

Ahora, es importante entender que el trozo de papel que Jiki pone en la caja queda fijo en ese momento. Incluso si la hora real cambia mientras tu programa se está ejecutando, la caja todavía tiene ese trozo de papel con 14:35 escrito. Una vez que algo está en la caja, queda fijo ahí. No cambia mágicamente. Si en el futuro queremos volver a poner la hora actual en la caja, necesitamos usar nuestra función `getCurrentTime` nuevamente para obtenerla.

La mayoría de las funciones que devuelven cosas también tienen argumentos. Por ejemplo, tal vez tengamos una función `join` (unir) que toma dos strings como argumentos y los devuelve unidos con un espacio. Así que si usamos una máquina `join` con `"Hello"` y `"World"` como argumentos, por la rampa sale un solo string con `"Hello World"` escrito.

```javascript
join("Hello", "World"); // "Hello World"
```
