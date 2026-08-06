---
title: "Argumentos de función"
description: "Colocar valores en las ranuras de una función para cambiar su comportamiento cada vez que se ejecuta."
en_md5: 0bd82377f2407de5fe030511752d5503
---

Una de las cosas más poderosas de las máquinas, de las funciones, es que muchas te dejan ponerles información que, cuando las ejecutas, cambia lo que hacen.

Hasta ahora, hemos visto máquinas que se parecen un poco a cajas, como la máquina `move` (mover).

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-inputs/move-machine.webp"
  alt="La máquina move, una caja simple sin ranuras"
  width="322"
  height="400"
/>

Pero algunas máquinas tienen ranuras, como esta máquina `walk` (caminar). La máquina `walk` es igual que la `move`. Mueve al personaje (_character_ en inglés) hacia adelante, pero Jiki puede usar la ranura para indicar cuántos pasos debe avanzar el personaje. Así que en vez de usar la función `move` tres veces seguidas: `move`, `move`, `move`, ahora puedes usar la función `walk` y decirle a Jiki que ponga el número tres en la máquina.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-inputs/walk-machine-slot.webp"
  alt="La máquina walk, con una ranura en la parte superior para el número de pasos"
  width="481"
  height="400"
/>

Para hacer esto en código, igual escribimos el nombre de la función, en este caso `walk`, y ponemos el paréntesis que abre. Luego, antes del paréntesis que cierra, indicamos qué queremos que sea el argumento (_input_ en inglés). En este caso, que el argumento sea tres, para que `walk` avance tres pasos:

```javascript
walk(3)
```

Cuando Jiki ve eso, toma el número tres; puedes imaginarte ese número como una monedita, y él la mete en la ranura de la máquina antes de girar la manivela para encenderla.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-inputs/jiki-coin-into-slot.webp"
  alt="Jiki metiendo el número 3 como una moneda en la ranura de la máquina walk y luego girando la manivela"
  width="421"
  height="400"
/>

Para funciones que dibujan rectángulos y círculos, tienes que indicarle a Jiki varios números distintos, especificando cosas como qué tan lejos de la izquierda debe estar, qué tan lejos de arriba debe estar, el ancho y la altura del rectángulo.

En el mundo de Jiki, son solo ranuras diferentes, una para cada uno de esos números.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-inputs/two-machines-inputs.webp"
  alt="La máquina de rectángulos con ranuras para izquierda, arriba, ancho, altura, y la máquina de círculos con ranuras para cx, cy, radio"
  width="396"
  height="400"
/>

Así que en nuestro código escribimos cada número y ponemos una coma entre ellos. El nombre de la función, un paréntesis, un número para cada argumento, separados por comas, y luego cerramos el paréntesis:

```javascript
rectangle(10, 20, 30, 40)
```

Si intentas usar una función con un número incorrecto de argumentos, vas a recibir un error. Por ejemplo, si tratas de poner un argumento en una máquina que no tiene ranura, Jiki te dirá que no puedes. Y si intentas usar una máquina que sí tiene ranura pero no le dices a Jiki qué poner dentro, también se detendrá y se quejará. Pruébalo si te sientes un poco rebelde y mira qué pasa. Vas a cometer muchos errores como este a medida que las cosas se complican. Trata de no estresarte ni frustrarte. Todos aprendemos de los errores. De hecho, es la forma más rápida de que nuestro cerebro internalice las cosas. Y todos cometemos estos errores. Todos empezamos desde cero, así que no te estreses.

Otra cosa que vale la pena mencionar: a veces en los ejercicios verás líneas que empiezan con dos barras diagonales, `//`. Estas se llaman comentarios (_comments_ en inglés). Son notas privadas solo para ti que Jiki ignora por completo. Cuando Jiki ve una línea que empieza con estas dos barras, simplemente la salta y pasa a la línea siguiente. Los comentarios te permiten escribir tus propias notas. Son muy útiles para recordarte cómo funcionan las cosas. A menudo, también hay comentarios escritos para ti, así que cuando empieces un ejercicio puede que te sugieran dónde escribir código o cómo resolver algo. Pero siéntete libre de añadir tus propios comentarios también.

Al final de las instrucciones de un ejercicio, verás información sobre las funciones que puedes usar, exactamente los argumentos que necesitas poner.
