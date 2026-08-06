---
title: "Animación"
description: "Engañar al ojo para que vea movimiento pintando de nuevo el fondo y redibujando cada fotograma en una posición ligeramente distinta."
en_md5: 536994294072afea52dab51d3bb7cab8
---

Hasta ahora, cuando hemos usado el bucle `repeat` (repetir) para dibujar cosas, cada cosa nueva que dibujábamos se sumaba a la imagen. Si dibujábamos un ladrillo nuevo en una pared, rellenaba un hueco. Si dibujábamos 10 círculos, veíamos 10 círculos en la pantalla. Es como una pintura. Una vez que pones pintura en la pared, no desaparece cuando pintas algo nuevo a su lado. Se queda ahí. Pero, ¿y si queremos hacer que algo parezca moverse?

¿Alguna vez has visto un flip book? Eran muy populares cuando yo era niño, ahora ya no tanto. Un flip book es un librito donde cada página tiene un dibujo ligeramente distinto. Al pasar las páginas rápido, tus ojos ven los dibujos cambiar y tu cerebro cree que algo se mueve. En realidad no se está moviendo. Solo son muchas imágenes un poco diferentes, una detrás de otra. Y así es exactamente como funciona la animación en código. El truco es el mismo. Antes de dibujar una escena nueva, pintamos todo el lienzo con un color de fondo, un poco como empezar una página nueva en nuestro flip book, y después hacemos un pequeño cambio en la escena para que parezca movimiento.

<img
  class="concept-image"
  src="/static/images/concept-assets/animation/flip-book-pages.webp"
  alt="Un flip book que muestra una figura de palitos corriendo, cada página ligeramente diferente para que la figura parezca moverse"
  width="500"
  height="274"
/>

Entonces, si tomamos un bloque de código conocido donde dibujamos círculos a lo ancho de la pantalla, definimos una variable `position` (posición) y tenemos un bloque `repeat` donde dibujamos un círculo y después movemos `position` una unidad a la derecha. Si ejecutamos ese bloque `repeat` 100 veces, veremos 100 círculos a lo largo de la pantalla.

```javascript
let position = 0
repeat(100) {
  circle(position, 50, 5, "blue")
  position = position + 1
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/animation/circles-trail.webp"
  alt="Una estela de 100 círculos azules dibujados de izquierda a derecha en la pantalla"
  width="500"
  height="197"
/>

Ahora, mira lo que pasa si simplemente agregamos un rectángulo sencillo antes de dibujar el círculo cada vez.

```javascript
let position = 0
repeat(100) {
  rectangle(0, 0, 100, 100, "white")
  circle(position, 50, 5, "blue")
  position = position + 1
}
```

En lugar de una estela de círculos, nuestros ojos ahora son engañados y ven un solo círculo que parece deslizarse por la pantalla.

<img
  class="concept-image"
  src="/static/images/concept-assets/animation/circle-glide-frames.webp"
  alt="Una secuencia de fotogramas, cada uno un lienzo blanco fresco con un solo círculo azul un paso más a la derecha"
  width="500"
  height="187"
/>

Cada vez que pasamos por el bucle, pintamos un fondo completamente nuevo, tapando todo lo que había antes, y después dibujamos el círculo en su nueva posición.

Cada vuelta del bucle es como una página nueva en el flip book.

Y lo clave que hay que entender aquí es que no estamos moviendo el círculo. El círculo no es un objeto que se desliza. Es solo un dibujo. Cada vuelta del bucle, pintamos encima del dibujo anterior y hacemos uno completamente nuevo un poco más a la derecha. Tu ojo lo une todo y ve movimiento, pero en realidad solo son muchos dibujos separados, uno detrás de otro.

Puedes usar esta idea para crear un atardecer. Haces que el sol se mueva, cambias su tamaño, cambias su color. Es la misma técnica. Define algunas variables, pinta un fondo fresco y dibuja todo. Actualiza las variables y luego repite.
