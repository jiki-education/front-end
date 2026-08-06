---
title: "Colores RGB"
description: "Mezclar luz roja, verde y azul de 0 a 255 para obtener cualquier color que quieras en la pantalla."
en_md5: 8ed038f6d17072b6fb6eaae6bef15c2c
---

RGB nos permite pensar en los colores como una mezcla de rojo, verde y azul. Eso es lo que significan las siglas RGB: rojo (_red (R)_ en inglés), verde (_green (G)_ en inglés), azul (_blue (B)_ en inglés). Si recuerdas cuando mezclabas pinturas en la escuela, es una idea parecida, solo que en lugar de pintura, estamos mezclando luz.

<img
  class="concept-image"
  src="/static/images/concept-assets/rgb/rgb-mixing-circles.webp"
  alt="Tres círculos superpuestos de luz roja, verde y azul que se mezclan para obtener amarillo, magenta, cian y blanco"
  width="500"
  height="390"
/>

En muchos ejercicios, vas a tener una función llamada `rgb(red, green, blue)`, que tomará tres números como argumentos, uno para el rojo, otro para el verde y otro para el azul, y devolverá un color.

Los números que puedes usar como argumentos van desde cero hasta `255`. Cero significa que no quiero nada de ese color, y `255` significa que mezcles la mayor cantidad posible de ese color. Así que si usamos la función `rgb` con `255`, cero y cero como argumentos, lo que estamos diciendo es que quiero todo el rojo. Recuerda que `255` es el número más grande que puedes poner ahí. Pero no queremos nada de verde ni de azul, así que esos dos son cero. Entonces obtenemos rojo, y podemos guardar ese rojo en una variable y luego usarlo en la función `circle`, tal como hemos estado haciendo con los strings nombrados. ¿Qué pasa si usamos la función `rgb` con cero, `255`, cero? Ahora estamos diciendo nada de rojo, todo el verde, nada de azul. Así que obtenemos un círculo verde. ¿Y si queremos amarillo? El amarillo es una mezcla de rojo y verde. Así que podemos decir dame todo el rojo, todo el verde y nada de azul, y eso nos dará amarillo. Y podemos usar números más pequeños. Si queremos algo de rojo, nada de verde y mucho azul, obtendremos morado. Y mucho rojo, un poco de verde, un poco más de azul, nos da un rosa. Así que eso es RGB. Mezclamos rojo, verde y azul para obtener diferentes combinaciones.

```javascript
rgb(255, 0, 0) // rojo
```

<img
  class="concept-image"
  src="/static/images/concept-assets/rgb/rgb-red.webp"
  alt="Un círculo rojo producido por rgb(255, 0, 0), todo rojo y nada de verde ni azul"
  width="436"
  height="400"
/>

```javascript
rgb(255, 255, 0) // amarillo
```

<img
  class="concept-image"
  src="/static/images/concept-assets/rgb/rgb-yellow.webp"
  alt="Un círculo amarillo producido por rgb(255, 255, 0), todo rojo y todo verde sin azul"
  width="436"
  height="400"
/>

```javascript
rgb(230, 50, 170) // rosa
```

<img
  class="concept-image"
  src="/static/images/concept-assets/rgb/rgb-pink.webp"
  alt="Un círculo rosa producido por rgb(230, 50, 170), mucho rojo, algo de verde y un poco de azul"
  width="436"
  height="400"
/>

RGB es genial cuando quieres ajustar un componente específico, cuánto rojo, cuánto verde, cuánto azul.
