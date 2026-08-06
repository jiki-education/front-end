---
title: "El operador `not`"
description: "Usar `!` para invertir un booleano: true se vuelve false y false se vuelve true, útil para alternar o invertir comprobaciones."
en_md5: 842c4a4e9cb1fd11c4318a1508296e27
---

Hasta ahora, cuando comparábamos cosas para ver si son iguales, usábamos tres signos igual. A veces, sin embargo, queremos verificar si las cosas no son iguales, y para esto usamos un signo de exclamación seguido de dos signos igual. Y en general, en programación, un signo de exclamación o _bang_ en inglés, como creo que le llaman nuestros amigos estadounidenses, significa no. Así que imagina que trabajas en una tienda y la gerencia ha decidido que no se permiten atuendos disco.

<img
  class="concept-image"
  src="/static/images/concept-assets/logical-not/shop-bouncer.webp"
  alt="Un guardia en la puerta de una tienda revisando los atuendos de una fila de personas"
  width="451"
  height="400"
/>

Podemos decir: «Si el atuendo no es disco, abre la puerta». La sentencia if funciona exactamente igual.

```javascript
if (outfit !== "disco") {
  openDoor()
}
```

Solo que la condición devuelve true si las cosas son diferentes y false si son iguales. Así que podríamos escribir lo mismo diciendo: «Si el atuendo es disco, no hagas nada. Si no, abre la puerta». Pero en general, es más fácil y limpio usar el operador `not` (_operator_ en inglés) para realmente saber y decir lo que quieres.

Una cosa más relacionada con esto. A veces vas a tener una variable que es true y quieres invertirla a false, o vas a tener algo que es false y quieres invertirlo a true, y podemos usar esto para llevar el control de algo. Imagina que tenemos algo rebotando de izquierda a derecha y tenemos una variable llamada `movingRight` (que significa moviéndose a la derecha), que es true cuando se supone que te mueves a la derecha. Pero cuando quieres alternarlo (_toggle_ en inglés) a false, al chocar con el borde derecho.

<img
  class="concept-image"
  src="/static/images/concept-assets/logical-not/pong-court.webp"
  alt="Una cancha estilo Pong con paletas y una pelota rebotando de lado a lado, que ilustra cómo alternar una variable movingRight"
  width="500"
  height="352"
/>

Podríamos hacer esto diciendo: «Si `movingRight` es igual a true, `movingRight` es igual a false. Si no, `movingRight` es igual a true». Esa es una forma de alternar la variable. Entonces Jiki mirará `movingRight` para ver si es true o false, luego calculará el opuesto y volverá a poner ese valor en la caja.

```javascript
if (movingRight === true) {
  movingRight = false
} else {
  movingRight = true
}
```

Pero hay una forma más ordenada de hacerlo, y es usar el mismo signo de exclamación o bang:

```javascript
movingRight = !movingRight
```

Y eso lo invierte. `!movingRight` significa lo opuesto de lo que era antes.

Así que si `movingRight` era true, ahora es false. Si era false, ahora es true. Jiki obtiene lo que hay actualmente en la caja, y ese bang le dice que encuentre lo opuesto. Entonces lo opuesto de true es false. Lo opuesto de false es true, y luego lo vuelve a poner en la caja. Esto es exactamente lo mismo que esa sentencia if/else más larga, pero es mucho más ordenado y conciso de escribir.
