---
title: "Bucle de repetición"
description: "Uso de la palabra clave `repeat` para decirle a Jiki que ejecute el código dentro de las llaves un número específico de veces."
en_md5: 8ae468aa2be428f22b6eef47b3bdea68
---

Hasta ahora, todo se ha escrito de forma lineal: Jiki sigue cada instrucción en orden, de arriba hacia abajo.

Ahora vamos a ver cómo Jiki puede salir de este flujo estricto de arriba hacia abajo, y en concreto cómo podemos decirle a Jiki que ejecute la misma sección de código muchas veces seguidas.

Por ejemplo, imagina que estás en el laberinto y quieres avanzar 10 pasos. Existe la función `walk` para ayudarte con esto, pero ¿y si no existiera? ¿Qué pasaría si solo tuvieras la función `move` (mover)?

En lugar de escribir `move` 10 veces seguidas, lo que se vuelve muy repetitivo, lo que necesitamos poder hacer es decir: «Oye, Jiki, haz lo siguiente que te diga 10 veces.

`Move`».

Para hacer esto con código, necesitamos usar nuestra primera palabra clave (_keyword_ en inglés), y las palabras clave son instrucciones que Jiki entiende. Se parecen un poco a las máquinas, pero no lo son. Cuando Jiki ve una palabra clave, no busca una máquina en el estante; simplemente sabe qué hacer. Lo tiene integrado en su cerebro. Hay unas 20 palabras clave distintas que vamos a aprender durante el curso, y la primera de ellas es la palabra clave `repeat`.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/jiki-keywords-2.webp"
  alt="Jiki rodeado de palabras clave como repeat, if, else, and, or, con la nota de que las palabras clave son instrucciones que Jiki entiende"
  width="358"
  height="400"
/>

La palabra clave `repeat` hace exactamente lo que dije antes. Le dice a Jiki: «Repite esto que te diga a continuación esta cantidad de veces». Echa un vistazo a este código. Primero, usamos la palabra clave `repeat` para decirle a Jiki que va a hacer algo varias veces. Luego ponemos cuántas veces queremos que Jiki repita la acción entre paréntesis, y después tenemos estas llaves, y dentro de esas llaves están las instrucciones que queremos que Jiki repita. Este patrón es increíblemente común en programación. Especificamos una palabra clave, generalmente con cierta información como la cantidad de veces que hay que hacer algo en este caso, y luego un bloque de código (_code block_ en inglés) entre llaves. Volviendo al mundo del laberinto, en lugar de escribir `move`, `move`, `move`, `move`, podemos escribir: repite cuatro veces `move`.

```javascript
repeat(4) {
  move()
}
```

Jiki verá ese código y usará la máquina `move` cuatro veces seguidas.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/jiki-running-loop.webp"
  alt="Jiki usando la máquina move cuatro veces seguidas, una tras otra"
  width="421"
  height="400"
/>

Y tampoco estamos limitados a tener una sola cosa dentro de esas llaves. Jiki puede hacer varias cosas de forma repetida. Podemos decirle a Jiki que haga `move`, luego `turnLeft`, y que repita todo eso cuatro veces. Si Jiki ve esto, usará la máquina `move`, luego la máquina `turnLeft`, luego la máquina `move`, luego la máquina `turnLeft`, luego la máquina `move`, etc., hasta que haya hecho ambas cuatro veces.

```javascript
repeat(4) {
  move()
  turnLeft()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/if-else-code.webp"
  alt="Jiki usando la máquina move y luego la máquina turnLeft, repitiendo el par de acciones cuatro veces"
  width="500"
  height="390"
/>

A estas instrucciones de repetición las llamamos bucles (_loops_ en inglés), y hay muchos tipos de bucles distintos que podemos usar y que funcionan de manera un poco diferente.

Hay una cosa más que saber: mantener el código limpio y ordenado se vuelve esencial cuando trabajamos con bucles. Cuando tu código tiene una buena estructura visual, es muy fácil ver qué está pasando. Pero si no es así, si te olvidas de indentar bien o mezclas la indentación, las cosas se vuelven confusas muy rápido. Por eso en este curso siempre seguimos una regla. Siempre pones la llave de apertura en la misma línea que la sentencia (_statement_ en inglés) `repeat`. Siempre pones la llave de cierre en su propia línea, después de la sentencia, y siempre indentas el código entre ellas con dos espacios. De esa forma todo se mantiene muy ordenado, y si te olvidas o intentas seguir otro patrón, te dará un error.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/multiple-things-in-loop.webp"
  alt="Jiki señalando la indentación y el salto de línea que mantienen ordenado el bloque de código de un bucle"
  width="500"
  height="398"
/>
