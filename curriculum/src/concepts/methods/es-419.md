---
title: "Métodos"
description: 'Funciones que pertenecen a un valor y se llaman con notación de punto, como `"Jeremy".includes("e")` o `"Jeremy".toUpperCase()`.'
en_md5: 37c097a81459cd2ff4ae684559bd4311
---

Hasta ahora, cuando hemos pensado en los strings o en los números, los hemos considerado como cosas bastante estáticas.

Y aunque lo son, también tienen mucha funcionalidad incorporada que Jiki puede usar.

A medida que avancemos, vamos a ir aprendiendo sobre esta funcionalidad, sobre este tipo de habilidades que tienen y que te hacen la vida mucho más fácil.

Hay dos tipos de habilidades que vamos a ver: propiedades (_properties_ en inglés) y métodos (_methods_ en inglés).

Los métodos son funciones que pertenecen al string.

Así que en vez de escribir una función a la que le pasamos un string como argumento, podemos usar un método directamente sobre el string.

Por ejemplo, ¿recuerdas una función que verifica si un string tiene una letra en particular dentro? Bueno, los strings en realidad tienen un método llamado `includes` (contiene) que hace eso, y lo podemos usar con la misma sintaxis de punto que viste para las propiedades.

La diferencia con las propiedades es que cuando escribimos estos, los escribimos como funciones con paréntesis y argumentos.

Así que podemos escribir:

```javascript
"Jeremy".includes("e") // true
```

Y obtendremos `true`, porque `"Jeremy"` tiene una `"e"` dentro.

<img
  class="concept-image"
  src="/static/images/concept-assets/methods/jiki-writing-jeremy.webp"
  alt="Jiki escribiendo el string Jeremy en una hoja de papel"
  width="359"
  height="400"
/>

Los métodos son diferentes a las propiedades porque no son datos estáticos. En realidad son funciones. Puedes imaginarlos como funciones que tienen una caja incorporada con el string adentro.

Cómo funcionan no importa mucho por ahora. No vas a estar construyéndolos por un buen tiempo. Lo único que necesitas saber es que usas un método poniendo un punto y luego la sintaxis normal de una función.

Una cosa que debes saber sobre los strings es que los métodos no cambian nada dentro del string. Por ejemplo, existe un método `toUpperCase` (a mayúsculas) que devuelve el string con todas las letras en mayúsculas. Pero eso no cambia el string original. Ese todavía contiene `"Jeremy"` escrito solo con la J mayúscula. En vez de eso, Jiki crea un nuevo string que está todo en mayúsculas.

```javascript
const name = "Jeremy"
const bigName = name.toUpperCase()

log(bigName) // "JEREMY"
log(name) // "Jeremy"
```
