---
title: "Crear tus propias funciones"
description: "Usar la palabra clave function para construir tus propias máquinas que Jiki puede poner en sus estantes y reutilizar."
en_md5: 93286a30a373b5604b60b3c109ad00a3
---

Hasta ahora, has estado usando funciones que se hicieron para ti, funciones como `circle`, `rectangle`, `moveRight`, `shoot`. Todas esas son funciones que se crearon y se pusieron en los estantes de Jiki.

Pero ahora es momento de que empieces a crear tus propias funciones.

Para mostrarte cómo hacerlo, vamos a ver cómo construir una nueva función para el laberinto llamada `walk5` (caminar5).

Esta función siempre va a mover al personaje cinco pasos hacia adelante. No es la función más útil del mundo, la verdad, pero es una forma fácil y sencilla para comenzar.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions/walk-grid.webp"
  alt="El personaje en la cuadrícula del laberinto, listo para caminar cinco pasos hacia adelante"
  width="500"
  height="314"
/>

Así que si te pidiera que escribieras código para mover al personaje cinco pasos hacia adelante, podrías escribir `move` (mover) cinco veces, o podrías usar un bucle de repetición. En este ejemplo, para mantenerlo simple, vamos a usar el método de escribir `move` cinco veces seguidas.

```javascript
move()
move()
move()
move()
move()
```

Eso es lo que queremos que esté dentro de nuestra función.

Ahora, agrega una línea debajo que le diga a Jiki que use esta función. Ya has visto esto muchas veces.

Y luego nuestro trabajo será envolver todas estas primeras cinco líneas en una función para que cuando Jiki use `walk5`, sean esas primeras cinco líneas de código las que se ejecuten.

Para convertir estas cinco líneas en una función, estos cinco `move` en una función, necesitamos usar una nueva palabra clave, la palabra clave `function`.

Cuando usamos la palabra clave `function`, tenemos que hacer dos cosas. Uno, especificar el nombre de la función. En este caso, es `walk5`. Y dos, usar llaves (`{}`) para envolver un código que diga: "Esto es lo que debes hacer dentro de la función". Así que podemos agregar eso a nuestro código y ahora le estamos diciendo a Jiki que cree una función llamada `walk5`, y luego, cuando se use `walk5`, él debe ejecutar estas cinco líneas de código.

```javascript
function walk5() {
  move()
  move()
  move()
  move()
  move()
}
```

Cuando Jiki ve esa palabra clave `function`, va a ir y construir una función nueva, poner esas instrucciones en un pizarrón dentro de ella, y luego poner una etiqueta en la máquina para `walk5`. Y después pondrá esa función en los estantes junto con todas las demás que están ahí.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions/jiki-machine-whiteboard.webp"
  alt="Jiki parado junto a una máquina nueva con un pizarrón adentro para escribir las instrucciones de la función"
  width="500"
  height="396"
/>

Ahora, no hay nada especial en esta función que creaste en comparación con las funciones integradas (_built-in_ en inglés). Todas simplemente están una al lado de la otra en sus estantes.

Y cuando uses la función, cuando escribas `walk5()`, Jiki simplemente irá a buscar la máquina de los estantes y la usará exactamente igual que como ha estado haciendo con cualquier otra función. Puedes imaginar que cada máquina tiene un mini Jiki viviendo adentro. El mini Jiki siempre tiene puesto un gorro genial. Y ese mini Jiki trabaja exactamente de la misma manera que el Jiki normal de afuera, siguiendo instrucciones de la misma forma.

Una cosa clave que hay que entender aquí es que cuando Jiki crea la función, en realidad no ejecuta el código. Solo está escribiendo ese código para usarlo después.

El personaje en el laberinto no se mueve en este momento, cuando escribes la palabra clave `function`.

Jiki construyó la máquina y la puso en los estantes. No es hasta que le dices que use la máquina escribiendo `walk5()` que eso realmente sucede.
