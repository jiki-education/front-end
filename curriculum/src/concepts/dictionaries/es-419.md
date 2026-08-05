---
title: "Diccionarios"
description: "Una hoja de libreta de espiral donde cada entrada tiene una clave a la izquierda y su valor a la derecha, dándote datos etiquetados en vez de una lista."
en_md5: b8a26ad63301df1d00ce08e1e429cf05
---

Los arrays son nuestra opción preferida cuando tenemos una lista de cualquier cosa: una lista de mentores, de calificaciones, de ingredientes… cualquier lista, lo que quieres es usar un array.

Pero hay otra estructura de datos (_data structure_ en inglés) que también es muy común cuando quieres algo un poco más complejo que una lista.

Imagina que queremos almacenar algo de información sobre mí: mi nombre, mi edad, dónde nací. Podrías usar un array para eso, pero no queda muy claro lo que está pasando cuando lo haces.

¿Es Inglaterra donde nací o donde vivo? ¿Es 42 mi edad o es otra cosa?

Y si quiero usar esto, tengo que recordar que la primera posición es para el nombre, la segunda para la edad, la tercera para el lugar de nacimiento. Es todo un poco desordenado, y es desordenado porque esto no es realmente una lista de cosas. Es más complejo que eso. Y ahí es donde entran los diccionarios (_dictionaries_ en inglés). Un diccionario es un nuevo tipo de estructura de datos. Es el quinto. Tienes strings, números, Boolean, arrays, y ahora diccionarios.

Y quiero que pienses en un diccionario como en una hoja de una libreta de espiral.

En el lado izquierdo tienes los encabezados, las palabras `"name"`, `"age"`, `"birthplace"`, y a esas las llamamos claves (_keys_ en inglés).

Y en el lado derecho, junto a cada encabezado, tienes los datos reales: `"Jeremy"`, `42`, `"England"`, y a esos los llamamos valores (_values_ en inglés).

Igual que los arrays, un diccionario es una sola cosa. Es una página de un cuaderno. E igual que los arrays, Jiki puede guardarlo en una variable, en una caja, o como argumento de una función, o puede recibir un diccionario de la rampa de salida. Así es como se ve un diccionario en código. Usamos llaves para indicar el inicio y el final, y dentro tienes pares: una clave a la izquierda, dos puntos, y luego el valor a la derecha. Y ponemos una coma entre cada par. Así que Jiki ve esto, saca su libreta de espiral y escribe `name`, `"Jeremy"`, `age`, `42`, y así con cada par.

Y cuando termina, arranca la hoja y la guarda en una caja etiquetada `person` (persona).

Hay algunas reglas que debes conocer. Las claves siempre son strings. Deben tener comillas alrededor, y cada clave debe ser única. No puedes tener dos claves llamadas `name` en el mismo diccionario.

Los valores pueden repetirse si quieres, pero las claves tienen que ser diferentes.

Y los valores pueden ser cualquier cosa. Pueden ser strings, números, Boolean, arrays, o incluso otros diccionarios.

También puedes tener un diccionario vacío, igual que teníamos un array vacío, y podemos empezar con eso y construir sobre él más adelante.

Entonces, tienes un diccionario, pero ¿cómo sacas algo de él?

Usamos la misma sintaxis de corchetes que usábamos con arrays y strings, pero en lugar de un número de posición, ponemos una clave. Así que si queremos obtener el nombre de alguien de un diccionario, escribimos:

```javascript
person["name"] // "Jeremy"
```

Eso le dice a Jiki que busque en el diccionario `person`, encuentre la clave `"name"` y saque su valor. Jiki va a la caja `person`, saca la página del cuaderno, revisa todas las claves hasta que encuentra `"name"`, lee el valor `"Jeremy"` y lo coloca en una caja nueva llamada `name`.

Los corchetes siempre significan lo mismo: estás metiendo la mano en algo y sacando algo. Con arrays y strings, usas un número para indicar de qué posición quieres obtener algo. Con diccionarios, usas un string como clave.

Es la misma idea, solo que con una sintaxis un poco diferente.
