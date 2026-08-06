---
title: "After Party"
description: "Averigua cuántos invitados puede traer una celebridad, usando dos listas que se corresponden."
en_md5: c31c0988af324530b986262f47d9a745
---

Volvemos a hacer el papel de portero. Pero esta vez, nos toca lidiar con celebridades de primera categoría en el After Party.

Cuando estas personas llegan a tu fiesta, esperan que las reconozcas solo por su nombre de pila. Brad Pitt no va a gastar saliva diciéndote su apellido; simplemente dirá «Brad» y te mirará como si tú fueras el incómodo.

Esta noche hay dos listas en tu portapapeles. La primera es `names`, los nombres completos de todos los invitados. La segunda es `plusOnes`, cuántas personas adicionales puede llevar cada invitado (sus «plus-ones»; es decir, los invitados extra que pueden traer). Las dos listas se escribieron juntas, entrada por entrada, en el mismo orden, por lo que están alineadas. Por ejemplo, la tercera entrada de la lista de nombres corresponde a la misma persona que la tercera entrada de la lista de plusOnes.

Escribe una función llamada `plusOnesFor` (que significa «invitados extra para»). La función recibe tres datos: la lista `names`, la lista `plusOnes`, y el **nombre de pila** de quien esté parado frente a ti en ese momento. Debe devolver el número de invitados adicionales que esa persona puede traer.

Pero ten cuidado. Se está formando una fila, y esta gente no hace fila en silencio. «Brad» significa Brad Pitt, no Bradley Cooper. Y alguno que otro es tan famoso que ha soltado su apellido por completo.

Algunos invitados están en la lista pero no tienen permitido traer a nadie, así que `0` es una respuesta perfectamente válida para un nombre que esté en la lista. Alguien que no esté en absoluto es un caso completamente distinto, y en ese caso debes devolver la cadena `"Not on the list!"`, exactamente como está escrita.

### Métodos y propiedades de los arrays

Al igual que los strings, los arrays también tienen métodos y propiedades. En este ejercicio te puede ser útil la propiedad `.length`. Funciona exactamente igual que la versión para strings, solo que ahora te dice cuántos elementos hay en el array, en vez de cuántas letras hay en el string. Por ejemplo:

```js
["Jeremy", "Erik", "Aron"].length
// 3
```

¡Diviértete!
