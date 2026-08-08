---
title: "Usar varias funciones juntas"
description: "Dividir un problema en funciones pequeñas con una única responsabilidad que se llaman entre sí, para que cada parte se mantenga simple y se pueda reutilizar."
en_md5: 7df3110b30c0f279d7f04d3b4e331a99
---

Hasta ahora, cuando escribías funciones, cada una más o menos se las arreglaba sola y contenía toda la lógica necesaria para funcionar.

Ahora vamos a ver cómo dividir funciones para tener funciones más pequeñas que trabajen juntas, en lugar de funciones grandes con muchas cosas a la vez.

Como regla general en programación, queremos que cada función haga lo mínimo posible. A esto lo llamamos una función con responsabilidad única (_single responsibility_ en inglés). Cada función debe hacer una sola cosa y usar otras funciones para las distintas partes secundarias de eso.

Veamos un ejemplo.

Imagina que tenemos una función cuyo trabajo es devolver un string que describe un nombre.

Una versión simple se vería así. Tenemos un bucle de conteo, algo que ya has escrito, y luego una plantilla de string que arma el resultado.

```javascript
function describeName(name) {
  let length = 0
  for (const letter in name) {
    length += 1
  }
  return `This name is ${length} letters long`
}
```

Esto funciona bien, pero está haciendo dos cosas. Hace una cosa bastante genérica, contar, y otra muy específica: armar este string en un formato particular.

Sería mucho más bonito dividir esto en dos funciones: una que se encargue de contar y otra que se encargue de describir un nombre en este formato particular.

```javascript
// Solo cuenta letras
function countLetters(str) {
  let count = 0
  for (const letter in str) {
    count += 1
  }
  return count
}

// Solo formatea el texto bien
function describeName(name) {
  const count = countLetters(name)
  return `The name has ${count} letters`
}
```

Así podemos reutilizar esa función genérica de contar en este formateo de string, y también en cualquier otro lugar que la necesitemos. Cuando necesitemos contar letras en un string, está totalmente separada de cualquier cosa relacionada con la impresión.

Puedes leer ambas funciones por separado y entender inmediatamente lo que hace cada una.

A medida que tus funciones se vuelven más complejas y tienes más, esta técnica es la diferencia entre tener código limpio y legible y un completo desorden y confusión.

Hay algo que vale la pena mencionar de nuevo: todo lo que creas dentro de una función no puede ser accedido por otras funciones a menos que lo devuelvas explícitamente.

Así que si intentas hacer referencia a la variable `count` (cuenta) desde dentro de la función `describeName` (describirNombre), no puedes, porque pertenece a la otra función.

<img
  class="concept-image"
  src="/static/images/concept-assets/function-composition/jiki-thinking.webp"
  alt="Jiki pensando, con una bombilla sobre su cabeza, sobre cómo las variables se mantienen privadas para cada función"
  width="361"
  height="353"
/>

En JavaScript, podemos crear variables al principio, arriba de todo, que se comparten entre funciones, pero realmente recomiendo que no lo hagas a menos que haya una muy buena razón.

Mientras más mantengas cada función independiente —la palabra técnica para eso es _pura_ (_pure_ en inglés), funciones puras—, más limpio será tu código y menos bugs vas a crear y tener.
