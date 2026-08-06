---
title: "Escenarios"
description: "Las diferentes condiciones de inicio con las que un ejercicio ejecuta tu código, para que tengas que hacer que funcione en todas ellas."
en_md5: d5c4ee54eed8083e13f18bb7d256b86d
---

Cada ejercicio incluye distintos escenarios, diferentes situaciones que tu código debe manejar.

Los verás como pequeños botones justo encima de la salida de cada ejercicio. Cada botón corresponde a un escenario diferente. Tu trabajo es escribir código que funcione para todos ellos, no solo para el primero. Déjame repetirlo: escribes tu código una sola vez, pero ese mismo código se ejecuta en cada escenario. La diferencia es que cada escenario puede estar configurado de manera un poco diferente, o las funciones que te dan pueden devolver cosas ligeramente distintas según el escenario en el que te encuentres.

<img
  class="concept-image"
  src="/static/images/concept-assets/scenarios/scenario-buttons.webp"
  alt="La fila de botones de escenarios justo encima de la salida de un ejercicio, marcados con un círculo para resaltarlos"
  width="500"
  height="318"
/>

Pongamos un ejemplo de un juego de golf. Tal vez necesites variar la distancia que rueda una pelota según el valor de retorno (_return value_ en inglés) de una función llamada `getShotLength` (obtener la distancia del tiro), que te dice qué tan lejos el golfista ha golpeado la pelota. Imagina que el jugador ha tenido que deslizar el dedo en su teléfono para indicar qué tan lejos ha golpeado la pelota.

<img
  class="concept-image"
  src="/static/images/concept-assets/scenarios/golf-game.webp"
  alt="Una escena de un juego de golf con un golfista, una pelota y una bandera en el hoyo a la derecha"
  width="412"
  height="400"
/>

El resultado que te llega es a través de esta función. Así que en un escenario, puedes usar la función `getShotLength` y esta devolverá `23`, un deslizamiento corto. En otro, devuelve `70`, un deslizamiento largo. En otro, devuelve `45`. Tu código necesita hacer rodar la pelota la distancia correcta para cada escenario con un solo programa, un solo conjunto de código. Vas a necesitar usar la función `getShotLength` para ver qué tan lejos fue el tiro y luego hacer rodar la pelota hasta ese punto.

```javascript
let distance = getShotLength()
```

Los escenarios garantizan que tu código realmente funcione bien. Es bastante fácil escribir código que funcione en una situación específica. Es mucho más difícil y valioso escribir código que funcione en muchas situaciones diferentes. Cuando resuelvas ejercicios, empieza con el primer escenario. Haz que funcione. Luego pasa al siguiente escenario y haz que funcione. A medida que tu código falle en un escenario diferente, piensa en qué es diferente y cómo necesita adaptarse tu código.
