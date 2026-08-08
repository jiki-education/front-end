---
title: "Else"
description: "Agregar una cláusula `else` después de un `if` para que se ejecute un bloque de código diferente cuando la condición resulta ser falsa."
en_md5: 4dd08e94d86dd11cd54793cf64008e3d
---

Los condicionales te permiten verificar condiciones y ejecutar código solo cuando algo es verdadero. Ahora conozcamos al cómplice de `if`, el `else`.

Con un condicional (_if statement_ en inglés), Jiki ejecuta el bloque de código cuando la condición es verdadera y se lo salta cuando es falsa. Pero ¿qué pasa si quieres que Jiki haga una cosa cuando la condición es verdadera y otra cosa cuando es falsa? Para eso sirve `else`. Podemos poner una cláusula `else` (_else clause_ en inglés) después de la llave de cierre del `if`, y Jiki ejecutará ese bloque si la condición del `if` es falsa. Volviendo al ejemplo del portero del club, ahora tenemos la opción de abrir la puerta o de rechazar a alguien, que probablemente es mejor que ignorarlos por completo como hacíamos antes. Imagínalo como una bifurcación en el camino. Jiki llega a esta bifurcación, verifica la condición y luego puede ir por un lado si es verdadera o por el otro si es falsa. Pero nunca va por los dos lados.

```javascript
if (age >= 21) {
  openDoor()
} else {
  turnAway()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/else/fork-in-the-road.webp"
  alt="Una bifurcación en el camino, en la puerta del club: abre la puerta cuando la condición es verdadera, rechaza a la persona cuando es falsa"
  width="500"
  height="332"
/>

Pero ¿qué pasa si tienes más de dos posibilidades? Imagina que nuestro portero está vendiendo entradas. Si tienes menos de trece, recibes una entrada infantil. Entre trece y veinte, una entrada juvenil. Veinte o más, una entrada de adulto. Ahora tienes tres resultados diferentes. Para esto, podemos agregar otro condicional después del `else`. Así que podemos decir: «Si esto, entonces haz esto. Si no, si esto otro, haz aquello. Si no, haz esta otra cosa». En este ejemplo, Jiki ve el `if` y verifica la primera condición. ¿Dieciséis es menor que trece? No. Entonces pasa al `else if`. ¿Dieciséis es menor que veinte? Sí, es verdadero. Entonces ejecuta ese bloque y entrega una entrada juvenil. Y ya está. No verifica nada más. No mira ese `else` final para nada. Cuando Jiki encuentra una condición que es verdadera, ejecuta ese bloque y se salta todo lo demás que haya debajo.

```javascript
if (age < 13) {
  childTicket()
} else if (age < 20) {
  teenTicket()
} else {
  adultTicket()
}
```

Esto es lo clave que hay que entender. Solo se ejecuta un bloque. Jiki recorre esta cadena, encuentra la primera condición verdadera, ejecuta ese bloque y sigue adelante.

Ahora, hay algo que es importante entender bien porque suele confundir. Hay una diferencia sutil pero muy importante entre escribir dos condicionales separados y usar `else if`. Imagina que estamos creando un programa que entrega un premio básico o un premio extra según la puntuación de alguien. Mira estas dos posibilidades. Una usa `else if` y la otra usa dos condicionales `if` separados. ¿Qué va a pasar de forma diferente?

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

En el primer caso, con el `else if`, verificamos si la puntuación es alta y entregamos el premio, y luego no ejecutamos el `else if`. Así que la persona, si tiene una puntuación mayor a cien, solo recibe el premio extra.

Pero en el segundo ejemplo, los dos `if` son totalmente independientes. Ambos se ejecutarán y ambos serán verdaderos. Así que aquí la persona recibe dos premios. En el primero, un premio. En el segundo, dos premios. Tómate un momento para asegurarte de que realmente entiendes esto.

También es interesante notar que cualquiera de las dos podría ser correcta según cómo esté diseñado el juego. Quizás el participante recibe un premio normal y uno extra, o quizás solo se le sube de categoría al premio extra. Ninguno de los dos fragmentos de código es correcto o incorrecto. Simplemente son útiles en situaciones diferentes. Pero necesitas saber cuál es el que piensas usar.
