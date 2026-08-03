---
title: "Bucles `for`"
description: "Un bucle con tres partes (un inicializador, una condición y un incremento) que te da control total sobre la iteración."
en_md5: e96f2e5a4106a88cfbca449c93a26108
---

Quizá recuerdes que el bucle `repeat` en realidad no existe en JavaScript. Es algo que agregamos para facilitarte un poquito la vida mientras arrancamos.

Entonces, ¿qué usamos en su lugar? Usamos un bucle `for` normal, y se ve así.

```javascript
for (let i = 0; i < 5; i++) {
  // ...
}
```

Imagínate que eso te hubiera aparecido el primer día. Seguro te habría asustado un poco.

Pero ahora ya tienes todo lo que necesitas para sentirte cómodo con esto. Así que vamos a desglosarlo.

Un bucle `for` tiene tres partes: un inicializador (_initializer_ en inglés), una condición y un incremento (_increment_ en inglés).

El inicializador, esta parte de `let i = 0`, se ejecuta al inicio de todo el bucle. Solo se ejecuta una vez, y aquí crea una caja llamada `i` (el índice) con valor cero. `i` es simplemente una letra que se usa para llevar la cuenta a medida que iteramos; por tradición se usan `i` o `x` para esto.

La siguiente parte (la condición) se evalúa cada vez antes de cada iteración del bucle.

Si la condición es verdadera, ejecutamos el bucle de nuevo.

Si no lo es, no lo ejecutamos.

Y por último está el incremento, el `i++`.

`i++` significa lo mismo que `i = i + 1`. Es solo una forma abreviada de aumentar `i` en uno cada vez.

Entonces, en este ejemplo, ponemos `i` en cero. Revisamos si `i` es menor que dos, y lo es, así que ejecutamos el bucle.

Y al final, aumentamos `i` en uno, así que `i` pasa a ser uno. Cero más uno es uno.

Y luego volvemos. Revisamos si uno es menor que dos.

Lo es, así que ejecutamos el bucle. Y al final, aumentamos `i` de nuevo. Ahora vale dos: uno más uno es dos.

```javascript
i = 0
i < 2 // true - ejecutar el bucle
...   // Hacer la iteración
i = i + 1 // 1

i < 2 // true - ejecutar el bucle
...   // Hacer la iteración
i = i + 1 // 2

i < 2 // false - salir del bucle
```

Vamos por tercera vez. Esta vez revisamos si dos es menor que dos, y no lo es, así que no ejecutamos el bucle y, de hecho, terminamos con él. Simplemente pasamos al código que haya debajo. Así que ejecutamos el bucle dos veces, y eso es útil saberlo. Siempre que empecemos en cero y tengamos una condición `i < n`, el número `n` es la cantidad de veces que se ejecutará el bucle.

Esto es lo mismo que decir `repeat` 2.

Entonces no es difícil, pero sí es mucho más enredado que simplemente escribir `repeat` 2. La ventaja del bucle `for` es que puedes hacer cualquier cosa en esos tres espacios. Puedes empezar en un número diferente, contar de más de uno en uno, contar hacia atrás o usar una condición que dependa de algo distinto a un simple contador. Esa flexibilidad es lo que hace que los bucles `for` sean el caballo de batalla de JavaScript.
