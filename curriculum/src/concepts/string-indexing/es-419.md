---
title: "Indexación de strings"
description: "Usar corchetes y un número de posición para extraer una sola letra de un string. Recuerda que las posiciones empiezan en cero."
en_md5: cd31e0366b3090b358494667003f54c9
---

Imagina que tienes mi nombre, Jeremy, y quieres sacar mi inicial J de él. ¿Cómo lo haríamos?

<img
  class="concept-image"
  src="/static/images/concept-assets/string-indexing/jiki-thinking.webp"
  alt="Jiki pensando en cómo sacar una sola letra de un string"
  width="361"
  height="353"
/>

Bueno, puedes pensar en un string como una serie de letras. Así que `"Jeremy"` tiene seis letras, J-E-R-E-M-Y, y cada una tiene una posición. `"J"` está en la primera posición, `"y"` está en la última posición.

Ahora, en JavaScript y en la mayoría de los lenguajes de programación, estas posiciones empiezan en cero. Así que la primera letra `"J"` está en la posición cero, luego viene `"e"`, que está en la posición uno, `"r"` en la dos, `"e"` en la tres, `"m"` en la cuatro y `"y"` en la cinco.

Ahora, esto de empezar en cero es bastante raro y, sinceramente, la vida sería más fácil si empezáramos a contar desde el uno, como en el mundo normal. Pero no es así. En la mayoría de los lenguajes de programación empezamos a contar desde cero, así que simplemente tienes que aprenderlo.

Así que si queremos obtener una letra en una posición específica, podemos usar corchetes con el número dentro.

Entonces, si decimos `"Jeremy"[0]`, estamos diciendo: dame la primera letra de la palabra `"Jeremy"`.

Si decimos `"Jeremy"[1]`, estamos diciendo: dame la segunda letra.

```javascript
"Jeremy"[0] // "J"
"Jeremy"[1] // "e"
```

Y también podemos hacer esto con variables. Así que si creamos una variable llamada `name` (nombre) y le asignamos como valor el string `"Jeremy"`, entonces podemos hacer `name[0]` y obtendremos `"J"` de nuevo.

```javascript
let name = "Jeremy"
name[0] // "J"
```

Una cosa que debes tener clara: lo que obtienes de `name[0]` es simplemente otro string. Es otro pedazo de papel con la J. No tiene nada de especial. Es un string igual que `"Jeremy"` es un string.

<img
  class="concept-image"
  src="/static/images/concept-assets/string-indexing/jiki-holding-j.webp"
  alt="Jiki sosteniendo un pedazo de papel nuevo con solo la letra J"
  width="500"
  height="289"
/>

Simplemente resulta que tiene una letra en lugar de seis.

Y hacer esto no afecta en absoluto al string original. No estamos arrancando la J ni nada por el estilo. Solo estamos encontrando cuál de las letras queremos y luego creando un nuevo string con esa letra.
