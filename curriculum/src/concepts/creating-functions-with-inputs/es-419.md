---
title: "Añadiendo ranuras de entrada a las funciones"
description: "Añadir ranuras de entrada a tus propias funciones para que puedan hacer cosas diferentes según los valores que les pases."
en_md5: f70d737888fcbda3306196ff069eb2f1
---

Las funciones que has creado hasta ahora siempre hacen exactamente lo mismo cada vez. `turnAround` (dar la vuelta) siempre gira a la izquierda dos veces. `shootIfAlienAbove` (dispara si hay un alien encima) siempre verifica y dispara.

Pero piensa en las funciones que has estado usando durante todo el curso: cómo hacen cosas diferentes según los argumentos. Rectangle toma left, top, width y height como argumentos, y luego dibuja un rectángulo diferente según lo que le indiques.

Ahora también añadiremos ranuras de entrada a tus propias funciones.

Necesitas saber dos cosas para hacerlo. La primera es cómo se ve esto en la práctica, lo que tienes que escribir, y la segunda es lo que realmente está sucediendo.

La primera parte es bastante sencilla. Solo tienes que añadir unos paréntesis normales y luego los nombres de los argumentos que quieras.

Imagina que estamos creando una función que debe disparar muchas veces. Llamémosla `shootMany` (disparar muchas veces).

La escribiríamos así:

```javascript
function shootMany(numShots) {
  // ...
}
```

Cuando quieras usar esta función, la llamas con la cantidad de disparos que quieras:

```javascript
shootMany(5)
shootMany(2)
```

Ahora, este es el punto clave. Cuando el código se ejecuta, lo que pongas en esa ranura, `5` o `2`, mini-Jiki, con el sombrero dentro de la función, toma ese argumento y lo pone en una caja llamada `numShots` (número de disparos), y luego coloca esa caja en los estantes dentro de la función para que la uses en el código de la función.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-inputs/numshots-box.webp"
  alt="Mini-Jiki dentro de la máquina shootMany colocando el argumento en una caja etiquetada numShots"
  width="500"
  height="376"
/>

Lo diré otra vez.

Cuando escribimos `shootMany(5)` para usar la función, Jiki, desde afuera, va y obtiene un `5` y lo coloca en la ranura de entrada de `shootMany`. Dentro de la máquina, mini-Jiki toma ese `5` y lo guarda en una caja llamada `numShots`, porque ese es el nombre que le diste a esa ranura de entrada, y luego coloca esa caja en los estantes dentro de la función, dentro de la máquina.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-inputs/numshots-on-shelf.webp"
  alt="Mini-Jiki colocando la caja numShots en los estantes dentro de la máquina shootMany"
  width="500"
  height="302"
/>

Y luego, dentro de la función, puedes usar la caja `numShots` como usarías cualquier otra caja. No hay nada mágico en el nombre `numShots`. Podríamos haberla llamado de cualquier forma. Todo lo que es es una instrucción para que mini-Jiki siempre cree una caja con esa etiqueta dentro de la función y ponga lo que se pase por esa ranura en esa caja.

Y una vez que tienes un valor en esa caja, puedes hacer todo lo que normalmente haces con cajas. Podrías usar la caja `numShots` como parte de un bucle `repeat` para disparar la cantidad correcta de veces. Y también puedes tener más de una entrada. Solo sepáralas con comas. Así que si tenemos una función llamada `drawStar` (dibujar una estrella) que dibuja una estrella según su posición superior izquierda, la escribirías así:

```javascript
function drawStar(left, top) {
  // ...
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-inputs/draw-star-two-slots.webp"
  alt="La máquina drawStar con dos ranuras de entrada, tomando dos valores separados"
  width="453"
  height="400"
/>

Y luego, cuando se llama a la función, mini-Jiki simplemente va a guardar los valores que se pasan a las entradas en cajas llamadas `left` (izquierda) y `top` (arriba), y luego las coloca en los estantes dentro de las funciones.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-inputs/draw-star-boxes-shelf.webp"
  alt="Mini-Jiki guardando los dos argumentos en cajas etiquetadas left y top en los estantes dentro de la máquina drawStar"
  width="431"
  height="400"
/>
