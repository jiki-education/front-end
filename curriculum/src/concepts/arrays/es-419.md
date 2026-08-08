---
title: "Arrays"
description: "Una cadena ordenada de elementos (strings, números, Booleans o cualquier otra cosa) que se mantienen unidos como un solo valor que Jiki puede pasar de un lado a otro."
en_md5: d26ccb9e04fbc77129f3199d63a95017
---

Has estado usando números, strings y Booleans, la palabra elegante para verdadero y falso, y a todos estos los llamamos tipos de datos (_data types_ en inglés). Ahora vamos a agregar nuestro primer tipo de dato compuesto (_compound data type_ en inglés).

Es un tipo de dato que puede contener varias cosas, no solo una, y este tipo de dato se llama arreglo (_array_ en inglés).

Cuando escuchas la palabra array, quiero que pienses en una cadena física que mantiene juntas un montón de cosas.

Esas cosas que sostiene pueden ser cualquier cosa: strings, números, Booleans, incluso otros arrays, incluso cosas que todavía no has aprendido, pero no nos preocupemos por eso ahora.

Todo en esta cadena tiene un orden: el orden en el que las cosas se fueron encadenando.

Así que un array contiene muchas cosas, pero es un solo elemento (_element_ en inglés), una sola cosa sólida: un único array que lleva muchos elementos adentro.

Jiki puede tomar ese array, esa cadena, y ponerlo en una caja, igual que puede poner un string en una caja o un número en una caja.

Puede ponerlo en una ranura de entrada de una máquina. Puede sacarlo de una rampa de salida. Este array es una sola cosa, y Jiki trabaja con él exactamente de la misma forma en que trabaja con strings, números y todo lo demás que has visto hasta ahora.

Ahora, en el código, un array también se ve un poco como una cadena. Tiene un corchete en cada extremo y luego muchas cosas que están encadenadas, separadas por comas.

Entonces, por ejemplo, si quisiéramos crear un array con los nombres de algunos de nuestros mentores, podríamos armar una caja llamada `mentors` (_mentores_) y poner esa cadena dentro de ella.

Escribiríamos `let mentors =`, exactamente igual que con cualquier otra caja, y luego tendríamos un corchete de apertura, muchos elementos, sus nombres separados por comas, y luego un corchete de cierre. Cuando Jiki ve esto, va y toma cuatro pedazos de papel, uno para cada nombre, luego toma una cadena nueva y los encadena a todos, y después pone esa cadena en la caja `mentors`.

Puedes poner cualquier cosa en un array: strings, números, Booleans, incluso una mezcla de cosas.

Estos son todos ejemplos de arrays completamente válidos.

También puedes crear un array vacío. Es simplemente una cadena sin elementos. Sigue siendo una cosa real. Todavía tiene sus dos extremos. Sigue siendo una cadena. Solo que no tiene objetos dentro. Pero puedes poner este array vacío en una caja, sacarlo después y usarlo más tarde.

Así que puedes crear un array con la sintaxis de corchetes, pero ¿cómo los usamos en realidad? ¿Cómo revisamos qué hay dentro y sacamos cosas? Bueno, exactamente de la misma forma en que lo hicimos cuando queríamos sacar letras de un string. Podemos usar la sintaxis de corchetes con números dentro.

Entonces, volvamos a nuestra lista de mentores. Si queremos sacar el primero, escribimos `mentors[0]`. Recuerda que en JavaScript contamos desde cero.

Y también podemos iterar a través de un array exactamente de la misma forma en que iterábamos a través de strings antes, usando `for-of`.

Los arrays funcionan exactamente igual. La única diferencia es que esta vez, en lugar de sacar una letra, sacamos lo que fuera el elemento del array. En este ejemplo, el nombre del mentor.

Entonces, la primera vez que agradecemos a alguien, agradecemos a `"DJ"`. La segunda vez, agradecemos a `"Becky"`, etc.

También podemos usar la propiedad `length` en los arrays, como aprendimos con los strings. Si tenemos un array con cuatro strings en la caja `mentors` y escribimos `mentors.length`, devolverá cuatro.

Y podemos usar `includes` exactamente igual en los arrays también. Podemos decir `mentors.includes("DJ")`, y devolverá `true`. Pero si decimos `mentors.includes("Frank")`, devolverá `false`.

Todo funciona exactamente igual que con los strings. Solo que estamos trabajando con los elementos de un array, no con las letras de un string.
