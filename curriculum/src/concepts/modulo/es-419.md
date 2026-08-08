---
title: "Residuo"
description: "Usar el operador `%` para obtener lo que sobra después de una división, y a menudo se usa para comprobar si un número es par o impar."
en_md5: fe49222bd3f3a019dd9f74a960c5dede
---

Hasta ahora hemos usado la suma, la resta, la multiplicación y la división para hacer operaciones aritméticas. Ahora vamos a presentar uno más, el operador de residuo (_remainder_ en inglés).

El operador de residuo se encarga de darte el residuo, lógicamente, cuando divides dos números, y lo escribimos con el signo de porcentaje. Entonces, si escribimos:

```javascript
10 % 4 // 2
```

estamos diciendo, o preguntando: «¿Qué sobra cuando dividimos 10 entre 4?». Y la respuesta es dos. Imagina que tienes 10 caramelos o nueces y quieres compartirlos por igual entre cuatro personas. Cada persona recibe dos, y al final sobran dos. Y eso que sobra es el residuo. Eso es lo que te da este signo de porcentaje.

<img
  class="concept-image"
  src="/static/images/concept-assets/modulo/sharing-candies.webp"
  alt="Una fila de diez caramelos que se reparten por igual entre cuatro personas, y quedan dos como residuo"
  width="500"
  height="22"
/>

Una de las razones por las que lo usamos muy seguido en código es porque podemos saber si algo se divide de manera exacta o no, y la aplicación más común que verás de esto es determinar si un número es par o impar. Los números pares, como sabes, se dividen exactamente entre dos. Los números impares siempre tienen uno de sobra cuando los divides entre dos.

Entonces, si tomas el cuatro, el seis o el ocho, y los divides entre dos, no sobra nada, mientras que el cinco, el siete o el nueve, si los divides entre dos, siempre sobra uno al final. Así que al escribir `if algo % 2 === 0`, estamos preguntando: «¿Es este número par?». Y eso puede ser útil para montones de cosas. Imagina crear rayas con colores diferentes o dividir una fila por la mitad, enviando a cada persona por uno de dos caminos según se acercan a ti.

Algo a tener en cuenta: puede que escuches a la gente llamar a este operador de residuo el operador módulo. El módulo y el residuo son básicamente lo mismo. Hay algunas pequeñas diferencias de las que probablemente no tendrás que preocuparte nunca, así que por ahora pensemos en él como el operador de residuo, ya que es mucho más fácil.
