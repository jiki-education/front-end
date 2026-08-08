---
title: "String invertida"
description: "Voltea un texto al revés."
en_md5: 9d47faf87b2864284ed64ce1300073ea
---

Invertir strings (leerlos de derecha a izquierda, en vez de izquierda a derecha) es una tarea sorprendentemente común en programación.

Por ejemplo, en bioinformática, invertir la secuencia de strings de ADN o ARN suele ser importante para varios análisis, como encontrar cadenas complementarias o identificar secuencias palindrómicas.

Tu tarea es crear una función llamada `reverse` (invertir), que toma un string como argumento y devuelve la versión invertida.

Ejemplos:

- Convierte "stressed" en "desserts"
- Convierte "strops" en "sports"
- Convierte "racecar" en "racecar" (un palíndromo)

### Esos dos últimos escenarios...

Los dos últimos escenarios se ven extraños, ¿no? ¿Qué está pasando?

Resulta que muchos emojis en realidad están formados por otros emojis unidos con espacios ocultos (de ancho cero).

El emoji de familia (👩‍👩‍👧‍👦) está formado por dos mujeres y dos niños. Cuando se invierte, puedes ver los caracteres individuales (👦‍👧‍👩‍👩).

El otro es un arcoíris y una bandera (🌈‍️🏳). Cuando inviertes el orden para obtener la bandera y luego el arcoíris, se convierte en la bandera arcoíris (🏳️‍🌈️).

Si construyes tu resultado carácter por carácter, todo esto debería funcionar sin problema. Si en cambio buscas un truco más astuto, es posible que los emojis se rompan.
