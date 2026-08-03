---
title: "Else If"
description: "Encadenar cláusulas `else if` para verificar varias condiciones en orden, ejecutando únicamente el primer bloque cuya condición sea verdadera."
en_md5: 5e1c9b2e77abbd41708f4c33b9aabd8f
---

Ya viste cómo `if` y `else` te dan dos caminos: hacer una cosa cuando una condición es verdadera y otra cuando es falsa. Pero, ¿qué pasa si tienes más de dos posibilidades?

Imagina que nuestro portero está vendiendo boletos. Si tienes menos de trece años, recibes un boleto infantil. Si tienes entre trece y veinte, un boleto juvenil. Con veinte o más, un boleto para adultos. Ahora tienes tres resultados distintos. Para esto, podemos agregar otro condicional después del `else`. Entonces podemos decir: «Si se cumple esto, haz esto. Si no, si se cumple esto otro, haz aquello. Si no, haz esto otro». En este ejemplo, Jiki ve el `if` y verifica la primera condición. ¿Dieciséis es menor que trece? No. Así que pasa al `else if`. ¿Dieciséis es menor que veinte? Sí, es verdad. Entonces ejecuta ese bloque y entrega un boleto juvenil. Y ahí termina. No verifica nada más. Ni siquiera mira el `else` final. Cuando Jiki encuentra una condición verdadera, ejecuta ese bloque y se salta todo lo demás que haya abajo.

```javascript
if (age < 13) {
  childTicket()
} else if (age < 20) {
  teenTicket()
} else {
  adultTicket()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/else-if/tickets.webp"
  alt="Tres boletos etiquetados como CHILD, TEEN y ADULT, uno por cada resultado de la verificación de edad"
  width="500"
  height="142"
/>

Esto es lo fundamental. Solo se ejecuta un bloque. Jiki recorre esta cadena, encuentra la primera condición verdadera, ejecuta ese bloque y sigue adelante.

Ahora, hay algo que realmente tienes que entender porque suele confundir a la gente. Existe una diferencia sutil pero muy importante entre escribir dos condicionales `if` separados y usar `else if`. Imagina que estamos creando un programa que entrega un premio básico o un premio extra según la puntuación de alguien. Mira estas dos posibilidades. Una usa `else if` y la otra usa dos condicionales `if` separados. ¿Qué va a ocurrir de manera diferente?

```javascript
if (score > 100) {
  bonusPrize()
} else if (score > 50) {
  basicPrize()
}
```

```javascript
if (score > 100) {
  bonusPrize()
}
if (score > 50) {
  basicPrize()
}
```

En el primer caso, con el `else if`, verificamos la puntuación alta y entregamos el premio extra, y después no ejecutamos el `else if`. Así que la persona, si tiene una puntuación superior a cien, solo recibe el premio extra.

Pero en el segundo ejemplo, los dos `if` son totalmente independientes. Ambos se ejecutarán y ambas condiciones serán verdaderas. Así que la persona aquí recibe dos premios. En el primero, un premio. En el segundo, dos premios. Tómate un momento para asegurarte de que realmente lo entiendes.

Además, es interesante notar que cualquiera de las dos opciones puede ser correcta según cómo esté diseñado el juego. Quizás el participante reciba un premio normal y uno extra, o quizás simplemente se le mejora al premio extra. Ninguno de los dos fragmentos de código es correcto o incorrecto. Simplemente son útiles en situaciones distintas. Pero necesitas saber cuál de las dos tienes intención de usar.
