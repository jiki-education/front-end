---
title: "Propiedades"
description: "Datos fijos sobre un valor, a los que se accede con la notación de punto y sin paréntesis, como `.length` para saber cuántas letras tiene un string."
en_md5: 0634cd72388bef118e9dd22131a3c1cd
---

Hasta ahora, cuando pensábamos en strings o números, los considerábamos cosas bastante estáticas.

Y aunque lo son, también tienen mucha funcionalidad incorporada que Jiki puede usar.

Hay dos tipos de capacidades que vamos a ver: las propiedades y los métodos.

Las propiedades son datos que le podemos preguntar a Jiki sobre las cosas. Por ejemplo, los strings tienen una propiedad llamada `length` (longitud), que Jiki puede usar para decirnos cuánto mide un string.

En lugar de tener que recorrer todas las letras para calcular cuánto mide un string, simplemente le preguntamos a Jiki.

Y para hacer esto, usamos una nueva sintaxis: el punto.

Por ejemplo, si tenemos el string `"Jeremy"` y queremos obtener su longitud, podemos escribir:

```javascript
"Jeremy".length // 6
```

Cuando Jiki crea un string, cuenta las letras y como que anota un número en la esquina con la cantidad que hay.

<img
  class="concept-image"
  src="/static/images/concept-assets/properties/jiki-counting-letters.webp"
  alt="Jiki contando las letras del string Jeremy y anotando el número en la esquina"
  width="359"
  height="400"
/>

Y luego, cuando usamos la propiedad `length`, Jiki simplemente va y revisa cuál era ese número. En nuestro ejemplo `"Jeremy".length`, cuando Jiki crea el string `"Jeremy"`, cuenta las letras, anota el número seis en la esquina, y luego cuando escribimos `"Jeremy".length`, va y lo revisa. Así que puedes pensar en las propiedades como datos sobre esa cosa.
