---
title: "Pangrama"
description: "Verifica si una oración contiene todas las letras del alfabeto, sin importar mayúsculas o minúsculas."
en_md5: 8fae2df6ec4385478e4236fa49e21256
---

Te damos la bienvenida a la segunda parte de la serie de Pangramas. Recuerda, un pangrama es una oración que usa cada letra del alfabeto al menos una vez.

Este ejercicio es una versión más compleja del anterior ejercicio de pangrama que resolviste, porque usa letras mayúsculas también. Eso añade una cantidad sorprendente de complejidad.

Crea una función llamada `isPangram` (verifica si es un pangrama) que tome una oración como string y devuelva un boolean que indique si es o no un pangrama.

Te hemos dado tu código anterior como punto de partida.

### Funciones auxiliares

Además de tu función auxiliar existente (que te sugerimos llamar `includes`), te recomendamos crear dos nuevas funciones auxiliares para resolver este ejercicio. Los nombres de las funciones son estándar y te recomendamos que los uses:

1. `indexOf(haystack, needle)`: Una función que calcula **dónde** está la aguja en el pajar. Así que, en lugar de devolver `true`/`false` como `includes`, devuelve el **índice** de la aguja. Por ejemplo, `indexOf("Jeremy", "r")` devolvería `2` (recuerda que contamos desde 0).
2. `toLowerCase(someString)`: Una función que toma un string y lo devuelve convertido a minúsculas. Por ejemplo, `toLowerCase("JeReMy")` devolvería `"jeremy"`.

¡Diviértete!
