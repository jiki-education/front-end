---
title: "Repetir sin contar"
description: "Dejar vacíos los paréntesis del bucle `repeat` para que Jiki siga adelante hasta que algo más le diga que se detenga."
en_md5: 5902e86c82b7bfe9ca519f9bdf8650ad
---

Hasta ahora, cuando usabas el bucle `repeat`, siempre especificabas un número que dice cuántas veces repetir. Repetir cinco veces, diez veces, cuarenta veces. A veces también has usado una variable para esto. Pero siempre le has dicho a Jiki exactamente cuántas veces repetir el bucle. Sin embargo, a veces no sabemos de antemano cuántas veces repetir. Piensa en el laberinto. Hace mucho, al principio de este curso, resolviste el laberinto escribiendo movimientos específicos. Podías ver el laberinto, contar los pasos y escribir la cantidad correcta de movimientos.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat-while/maze-known-path.webp"
  alt="Un laberinto donde el personaje puede ver el camino, contar los pasos y escribir exactamente los movimientos correctos"
  width="418"
  height="400"
/>

```javascript
move()
move()
turnLeft()
move()
move()
```

Pero ¿y si te digo: «escríbeme un código que pueda resolver cualquier laberinto que te dé»? Ese laberinto puede necesitar 10 pasos, o 50, o 200. No tienes ni idea de antemano.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat-while/maze-example.webp"
  alt="Varios laberintos distintos, de formas y tamaños variados, con Jiki preguntándose cómo resolver cualquiera de ellos"
  width="402"
  height="400"
/>

Así que necesitas una forma de decirle a Jiki simplemente que siga adelante. Que siga revisando hacia dónde puede ir, que siga tomando decisiones, que siga avanzando, una y otra vez hasta que termine.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat-while/jiki-treadmill.webp"
  alt="Jiki corriendo en una cinta de correr, simplemente siguiendo adelante una y otra vez"
  width="428"
  height="400"
/>

Y la forma de hacerlo es realmente sencilla. Simplemente no le des un número a la palabra clave `repeat`. Solo deja vacíos esos paréntesis. Si haces esto, Jiki simplemente seguirá adelante hasta que algo más le diga que se detenga. Más adelante veremos cuáles son esos «algo más». Pero por ahora, él simplemente seguirá adelante hasta que el ejercicio termine, o hasta que decida que ya lleva muchísimo rato, quiera un descanso y considere que ya es suficiente.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat-while/jiki-treadmill-exhausted.webp"
  alt="Jiki desplomado y agotado sobre la cinta de correr después de muchísimo rato, listo para rendirse y tomar un descanso"
  width="500"
  height="378"
/>
