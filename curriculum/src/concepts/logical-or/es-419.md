---
title: "La palabra clave `or`"
description: "Combinar dos condiciones con `||` para que la condición completa sea verdadera cuando al menos una de las partes lo sea."
en_md5: 4c9ebc144707760d944e0cddfac5a561
---

También podemos usar `or`, pero lamentablemente, de nuevo, no hay una palabra clave `or` bonita en JavaScript. En su lugar, tenemos que usar estas dos barras (_bars_ en inglés) juntas para indicar "o". Se ve raro, pero en realidad no lo es. Te vas a acostumbrar.

Así que podemos decir: si alguien tiene más de 20 años o va vestido de disco, entonces puede entrar. Vamos a tener una fiesta divertida con chicos vestidos de disco y adultos mal vestidos, lo cual suena razonable.

```javascript
if (age > 20 || outfit === "disco") {
  openDoor()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/logical-or/party-door.webp"
  alt="Jiki recibe en la puerta de la fiesta a una mezcla de chicos vestidos de disco y adultos vestidos casualmente"
  width="327"
  height="400"
/>

Hay algo que suele confundir con `and` y `or`, y es que cada lado del `and`/`or` tiene que ser una comparación completa. Así que incluso si estás comparando la misma variable en ambos lados, tienes que repetirla. No puedes escribir `if age is less than 13 or greater than 20`. Tienes que escribir `if age is less than 13 or age is greater than 20`. Necesitas que ambos lados sean comparaciones completas.

```javascript
if (age < 13 || age > 20)
```

Tienes que pensar en cuándo importan las dos condiciones y cuándo solo una de ellas necesita ser verdadera.
