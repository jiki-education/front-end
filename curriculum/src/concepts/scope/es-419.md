---
title: "Ámbito"
description: "Entender cómo las llaves crean su propio juego de estantes, de forma que las variables solo vivan lo que dura su bloque."
en_md5: 4d5fc2d1d304725660102e9aaceea4c3
---

Imagina un código que dibuja un círculo en un lugar distinto cada vez que se ejecuta, y queremos dibujar 10 círculos en lugares diferentes. Podríamos combinar esto con un bucle. Pero si estás prestando mucha atención, quizás hayas notado algo extraño aquí.

```javascript
repeat(10) {
  let left = Math.randomInt(0, 100)
  let top = Math.randomInt(0, 100)
  circle(left, top, 5, "blue")
}
```

Al principio, dije que había una regla: las cajas en los estantes de Jiki deben tener nombres únicos,

y que la palabra clave `let` crea una caja nueva cada vez que la usas.

Pero como el `let` está en un bucle, Jiki va a crear una caja nueva cada vez que el bucle se ejecuta.

Entonces, ¿el código está mal o está pasando algo raro aquí?

<img
  class="concept-image"
  src="/static/images/concept-assets/scope/thinking-jiki.webp"
  alt="Jiki con cara de desconcierto, preguntándose si el código está mal"
  width="384"
  height="400"
/>

Bueno, resulta que el código está bien. Esto es JavaScript perfectamente válido, y funciona gracias a un concepto llamado ámbito (_scope_ en inglés) o _scoping_.

El ámbito es algo que al principio probablemente te parecerá bastante sencillo, pero te garantizo que te causará dolores de cabeza por el resto de tu carrera. Incluso los desarrolladores más experimentados se topan con problemas de ámbito, y JavaScript es uno de los lenguajes más complicados en ese aspecto. Te digo esto para que, cuando te enfrentes a problemas de ámbito, no te sientas mal contigo. Pero también, presta mucha atención a esta parte porque es importante.

Cuando ves una llave en el código, eso crea lo que se llama un nuevo ámbito. ¿Qué significa eso? Bueno, puedes imaginarte que Jiki crea un nuevo juego pequeño de estantes en su taller cada vez que ve una llave. Y todas las cajas que crea mientras trabaja, ejecutando código dentro de esas llaves, esas cajas, esas cajas nuevas van al nuevo juego pequeño de estantes, no a los principales.

<img
  class="concept-image"
  src="/static/images/concept-assets/scope/shelves.webp"
  alt="Los estantes principales de Jiki junto a un nuevo juego de estantes más pequeño creado por una llave"
  width="500"
  height="205"
/>

Y cuando Jiki llega a la llave de cierre correspondiente, tira todas las cajas que están en este juego secundario de estantes.

<img
  class="concept-image"
  src="/static/images/concept-assets/scope/shelves-loop-end.webp"
  alt="Jiki tirando las cajas del juego secundario de estantes a la basura cuando llega a la llave de cierre"
  width="500"
  height="237"
/>

Así que cada vez que tenemos un bucle como este, podemos crear cajas que solo duran lo que dura cada ejecución del bucle. La caja `left` (izquierda) y la caja `top` (arriba) que ves aquí, solo duran hasta que alcanzamos la llave de cierre, y luego se tiran. Y Jiki alcanza esa llave de cierre cada vez que el bucle se ejecuta. O sea, son 10 veces en este programa. Así que 10 veces crea una caja llamada `left` y la vuelve a tirar.

<img
  class="concept-image"
  src="/static/images/concept-assets/scope/left-top-boxes-color.webp"
  alt="Dos cajas con las etiquetas left y top que solo duran una iteración del bucle"
  width="500"
  height="187"
/>

Así que, cuando creas una variable, tienes que decidir cuánto tiempo quieres que se quede. Si quieres que viva mucho tiempo, tiene que ir fuera de cualquier llave. Si quieres que dure solo una iteración (_iteration_ en inglés), una duración del bucle, entonces puedes ponerla dentro de las llaves. ¿Ves cómo esto puede volverse un poco confuso? Así que una buena regla para mantenerlo simple cuando estás empezando es poner todas tus variables cerca del inicio del código, fuera de las llaves, y luego solo actualizarlas dentro de las llaves. Por ejemplo, podríamos escribir el código de arriba con una sola caja `left` y `top` puestas a cero al principio y luego actualizadas cada vez dentro del bucle. Eso también es perfectamente válido. Ninguna es correcta o incorrecta. Hay mejores prácticas, pero las aprenderemos más adelante. Por ahora, experimenta, diviértete, ve qué te resulta más cómodo y trata de no preocuparte demasiado por esto.
