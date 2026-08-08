---
title: "Crear y usar variables"
description: "Cajas en los estantes de Jiki que guardan un valor con una etiqueta para poder recuperarlo más tarde en tu código."
en_md5: dd0834017a8d42c22cca25966c1fdd91
---

Las variables nos permiten almacenar información. Cuando programamos, a menudo necesitamos guardar algún número o algún string para usarlo después, y las variables son la forma de hacerlo. Entonces, alejémonos un poco en el almacén de Jiki y verás que tiene otro juego de estantes. Ya conocemos el primer juego de estantes que tiene las funciones, esas pequeñas máquinas como `move` y `rectangle`. Pero en este segundo juego de estantes, en lugar de máquinas, puedes ver muchas cajas, y esas cajas son lo que llamamos variables. Puedes decirle a Jiki que guarde cualquier cosa en estas cajas y, más tarde, pedirle que la saque de nuevo. Cada caja tiene un nombre, exactamente igual que las funciones tienen un nombre, y cada caja contiene solo una cosa. Por ahora, un número o un string. Pero más adelante en el curso veremos cómo guardar cosas más complejas en ellas.

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/two-shelves.webp"
  alt="Dos juegos de estantes en el almacén de Jiki: uno etiquetado como funciones con máquinas y otro etiquetado como variables con cajas"
  width="500"
  height="173"
/>

Entonces, ¿cómo le decimos a Jiki que haga una caja y ponga algo dentro? Usamos la palabra clave `let` (palabra clave para crear variables). La palabra clave `let` le dice a Jiki que necesita hacer una caja nueva. Puedes imaginarlo sacando una caja de cartón de su envoltura, armándola y luego mirando lo que viene después de la palabra `let`: esa es la etiqueta que pone en la caja, en este caso `name` (nombre). Entonces saca su pluma y escribe `name` en la etiqueta. Luego mira lo que viene después del signo igual (_equal sign_ en inglés). En este caso, es mi nombre, `"Jeremy"`, y como `"Jeremy"` es un string, toma un pedazo de papel y escribe `"Jeremy"` en él. Es solo un string, exactamente igual que los colores con los que has estado trabajando, y luego pone ese pedazo de papel en la caja.

```javascript
let name = "Jeremy"
```

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/jeremy-paper.webp"
  alt="Jiki sosteniendo un pedazo de papel con el string Jeremy escrito, listo para ponerlo en la caja"
  width="373"
  height="400"
/>

Así que le hemos dicho que haga una caja, le ponga una etiqueta y meta algo dentro, y ahora él va y coloca la caja en el estante. Y en cualquier otro momento de tu programa, Jiki puede ir a buscar esa caja del estante y mirar lo que hay dentro. Empieza a construir este modelo mental. Llevo toda una vida programando y todavía imagino, cuando escribo código, que estoy metiendo algo en una caja y que luego lo voy a sacar. Cuando veas la palabra clave `let`, piensa de verdad: «Bueno, eso significa que estoy haciendo una caja nueva».

Una nota sobre los nombres de las variables, las etiquetas de estas cajas. Tenemos algunas reglas al respecto. En primer lugar, los nombres de las variables no pueden tener espacios. Si quieres usar varias palabras para la etiqueta de una caja, juntamos las palabras y cambiamos la primera letra de cada palabra a mayúscula. A esto lo llamamos _camel case_. Imagina que las jorobas de un camello empujan la primera letra de cada palabra nueva para convertirla en mayúscula. Así que, si quieres una etiqueta que sea mi nombre, en lugar de escribir dos palabras con espacios, lo escribimos como una sola palabra con la N en mayúscula: `myName`.

Además, cada nombre de variable debe ser único. No puedes tener dos cajas con la misma etiqueta, y las variables tampoco pueden tener el mismo nombre que las funciones. Si lo olvidas, Jiki se confundirá y te dará un mensaje de error.

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/duplicate-names-confused.webp"
  alt="Jiki luciendo confundido ante dos cajas que tienen la misma etiqueta name"
  width="485"
  height="400"
/>

Así que veamos dónde podríamos querer usar una variable. Digamos que estamos dibujando un sol en el cielo. Sabemos que podemos usar la función `circle` (círculo) y darle cuatro entradas. Su `left` (izquierda), `top` (arriba), `radius` (radio) y `color`. Pero a medida que dibujamos muchas cosas y tenemos todos estos números dispersos por nuestro código, puede ser muy difícil seguirles la pista y leerlo. Así que, en su lugar, podemos crear variables para cada uno de left, top, `radius` y `color`, y luego referirnos a esas variables más tarde. Nuestro objetivo final aquí es poder usar la función `circle` y especificar nombres bonitos y legibles de cajas, y cuando Jiki vea esos nombres, sabrá que debe tomar las cajas del estante y usar lo que haya dentro.

Así que creemos algunas variables para esto. Empezamos con la posición izquierda del sol. Usamos la palabra clave `let` para decirle a Jiki que cree una caja nueva llamada `leftPosition` (posición izquierda). Fíjate en el camel case con la P mayúscula. Y le decimos a Jiki qué número va en la caja. Él la coloca en los estantes y luego hace lo mismo para `topPosition` (posición superior), `radius` y `color`.

```javascript
let leftPosition = 10
let topPosition = 20
let radius = 5
let color = "yellow"

circle(leftPosition, topPosition, radius, color)
```

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/name-on-shelf.webp"
  alt="Cajas etiquetadas en los estantes de variables, cada una guardando un valor para que Jiki lo recupere después"
  width="500"
  height="378"
/>

En cualquier momento de nuestro código, podemos volver a referirnos a estas variables y Jiki sacará los valores (_values_ en inglés) y los pondrá en una máquina. La otra gran ventaja de las variables es que cada vez que queramos dibujar algo en la misma posición que el sol, podemos reutilizar esas mismas variables `leftPosition` y `topPosition`. Tomemos otro ejemplo. Imagina que estás construyendo una pared con 30 ladrillos y quieres que todos los ladrillos tengan el mismo ancho y la misma altura. Es mucho mejor crear variables para el ancho y la altura al principio de tu código y luego referirte a ellas en el resto del código. Porque si luego quieres cambiar el ancho o la altura, solo tienes que cambiarlo en un lugar y todo lo demás se actualizará.
