---
title: "Concatenación de strings"
description: "Sumar strings con `+` para unir texto fijo y variables en un string más largo."
en_md5: 0e6c7a941a1fb1161445da27a4d7e818
---

Ya sabes lo que son los strings. Son pedazos de papel con texto en ellos.

Hasta ahora, cada string que has usado lo escribiste directamente. ¿Qué pasa si quieres construir un string a partir de variables o condiciones? ¿Cómo lo hacemos?

Hay dos maneras.

La primera se llama concatenación de strings (_string concatenation_ en inglés), que es una forma elegante y un poco confusa de decir sumar dos strings.

Imagina que tienes dos palabras, `"hello"` (hola) y `"world"` (mundo), y quieres crear un string que contenga `"hello world"`.

Podrías simplemente escribir `"hello world"` como un solo string, pero también podrías escribir `"hello " + "world"`, y eso te daría el mismo string.

Claro, en este caso no es tan útil. Pero, ¿y si tuviéramos una variable con el nombre de alguien y quisiéramos saludarlo?

Entonces imagina que tenemos una variable llamada `name` (nombre), y contiene `"Jeremy"` (el nombre Jeremy) a veces y `"Jiki"` (el nombre Jiki) otras veces. Queremos decir `"hello Jeremy"` o `"hello Jiki"` usando esa variable.

<img
  class="concept-image"
  src="/static/images/concept-assets/string-concatenation/jiki-name-box.webp"
  alt="Jiki sosteniendo una caja con la etiqueta name, que puede contener diferentes valores"
  width="207"
  height="400"
/>

Bien, podemos lograrlo usando este concepto de concatenación:

```javascript
"hello " + name // "hello Jeremy" or "hello Jiki"
```

Eso nos dará `"hello Jeremy"` o `"hello Jiki"`, o hola para cualquier otra persona, dependiendo de lo que haya dentro de la caja `name`.
