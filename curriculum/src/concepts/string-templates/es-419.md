---
title: "Plantillas de string"
description: "Usando comillas invertidas y marcadores de posición `${...}` para insertar valores directamente en un string en lugar de unir fragmentos con `+`."
en_md5: 7fd0e09ac3b32db5f159f8e772872104
---

Podemos usar algo llamado literales de plantilla (_template literals_ en inglés) para insertar strings dentro de otros strings.

Así que en lugar de sumar strings, podemos tener un string o una plantilla que tiene espacios para otros strings en su interior.

Para hacer esto, usamos comillas invertidas (_backticks_ en inglés) en lugar de comillas normales.

Las comillas invertidas son comillas que apuntan hacia atrás, como su nombre sugiere, pero es muy probable que nunca las hayas usado antes, así que tienes que encontrar la tecla correcta en tu teclado.

Las usamos para crear una plantilla que puede contener otros strings. Y luego, para insertar un string en la plantilla, usamos otra sintaxis extraña de signos de dólar y llaves. Así, por ejemplo, para lograr lo mismo que con la concatenación `"hello " + name` que acabamos de ver, podríamos escribir:

```javascript
`hello ${name}` // "hello Jeremy" or "hello Jiki"
```

<img
  class="concept-image"
  src="/static/images/concept-assets/string-templates/jiki-name-box.webp"
  alt="Jiki sosteniendo una caja etiquetada como `name`, el valor que se inserta en la plantilla"
  width="207"
  height="400"
/>

Y eso hace exactamente lo mismo que sumar los strings.

Pero cuando tienes varios strings que necesitan juntarse todos en un solo lugar, esto puede ser mucho más eficiente.

Te tomará un poco de tiempo acostumbrarte a esta sintaxis exacta, pero en realidad no tiene nada de complejo.
