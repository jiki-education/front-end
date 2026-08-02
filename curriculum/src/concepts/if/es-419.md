---
title: "Condicionales"
description: "Usar la palabra clave `if` para ejecutar un bloque de código solo cuando una condición es verdadera, como un portero dejando pasar a la gente."
en_md5: 8797e078e1ad90b7652373baf6f96f28
---

Hay una palabra clave que nos ayuda a decirle a Jiki que haga cosas solo en ciertas situaciones. Tal vez estás escribiendo código para vigilar la entrada de un bar, eres el portero, y Jiki solo debe abrir la puerta si alguien va vestido apropiadamente. O tal vez estás escribiendo código donde tú estás a cargo de agitar la bandera a cuadros al final de una carrera, pero Jiki necesita saber que solo debe hacerlo en la última vuelta. En este tipo de situaciones, usamos la palabra clave `if`.

<img
  class="concept-image"
  src="/static/images/concept-assets/if/bar-door-scenario.webp"
  alt="Jiki como portero decidiendo si permite la entrada al club nocturno"
  width="292"
  height="400"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/if/waving-flag.webp"
  alt="Jiki listo para agitar la bandera a cuadros al final de una carrera"
  width="266"
  height="400"
/>

Usamos la palabra clave `if` de una manera muy similar a `repeat`. Ponemos algo de información entre paréntesis normales. En este caso, esa información es la condición (_condition_ en inglés) que estamos verificando. Y luego ponemos un bloque de código entre llaves que ejecutamos solo si esa condición es verdadera.

```javascript
if (condition) {
}
```

Entonces, ¿cómo son estas condiciones? Bueno, normalmente son algún tipo de comparación (_comparison_ en inglés). Comparamos dos números o strings y verificamos si el resultado es verdadero o falso.

Así que piensa en estas como afirmaciones (_statements_ en inglés) que podrías decir en voz alta. Tres es menor que cinco. Eso es verdadero. Siete es menor que dos. Eso es falso.

Usamos símbolos para escribir estas comparaciones. Probablemente ya los conoces de matemáticas. Tenemos menor que, mayor que, menor o igual que, mayor o igual que, y también tenemos una forma de verificar si dos cosas son iguales, si son iguales. Y esta es un poco diferente de lo que probablemente estás acostumbrado porque usamos tres signos de igual seguidos para ver si dos cosas son iguales o diferentes.

<img
  class="concept-image"
  src="/static/images/concept-assets/if/comparisons-symbols.webp"
  alt="Una tabla de operadores de comparación: menor que, mayor que, menor o igual que, mayor o igual que, igual, y no igual, con ejemplos"
  width="449"
  height="400"
/>

Y esto nos ayuda a no confundirnos con cuando estamos asignando o actualizando variables, y usamos un signo de igual para significar «pon esto en la caja». Solo recuerda: tres signos de igual para comparar.

Puedes comparar strings también. Así que `"hello"` es igual a `"hello"`. Eso es verdadero. Los dos strings son iguales. Pero ten cuidado aquí, porque Jiki compara cada carácter (_character_ en inglés) en ambos strings en ambos pedazos de papel. Así que `"Hello"` con H mayúscula no es igual a `"hello"` con h minúscula. Son strings diferentes. Así que compararlos sería falso, porque la H mayúscula y la h minúscula son caracteres diferentes.

Por cierto, verdadero y falso se llaman _Booleans_ (booleanos), y esa es otra palabra que suena técnica. Pero en realidad es muy simple. Es solo una forma formal de decir que algo es verdadero o falso. Así que si te encuentras con la palabra Boolean, solo significa verdadero o falso. Veamos esto en acción. Imagina que estamos construyendo ese robot portero para un club, y vamos a decir que el portero solo debe abrir la puerta si la persona tiene 21 años o más. Así que tenemos una función `askAge` (pedir edad), que podemos usar para obtener la edad de alguien, y vamos a guardar el resultado en una variable llamada `age` (edad). Y luego podemos decir, si esa `age` es mayor que 20, abriremos la puerta. Así que si `askAge` devuelve `30`, la abrimos, y si devuelve `12`, no la abrimos.

```javascript
let age = askAge()
if (age >= 21) {
  openDoor()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/if/bouncer-open-close.webp"
  alt="Jiki abriendo la puerta a alguien con la edad suficiente, y negando la entrada a alguien demasiado joven"
  width="410"
  height="400"
/>
