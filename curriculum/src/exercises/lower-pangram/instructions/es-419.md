---
title: "Pangrama simple"
description: "Verifica si una oración usa todas las letras del alfabeto."
en_md5: 50b09bb1fbd35081cb842c55fc40e313
---

Un pangrama (_pangram_ en inglés) es una oración que usa **todas las letras del alfabeto al menos una vez**. ¡El pangrama en inglés más conocido es «the quick brown fox jumps over the lazy dog»!

Los próximos tres ejercicios tratarán sobre cómo determinar si una oración es un pangrama.

En este primer ejercicio, solo necesitas manejar letras minúsculas. El argumento solo contendrá letras minúsculas y otros caracteres como espacios, números o signos de puntuación, pero ninguna letra mayúscula.

Tu tarea es escribir `isPangram(sentence)` (que verifica si una oración es un pangrama), que recibe una oración como argumento y devuelve `true` si contiene todas las letras de la «a» a la «z» al menos una vez, o `false` en caso contrario.

### Funciones auxiliares

Para completar el ejercicio, no puedes usar bucles anidados. En cambio, como en el último ejercicio, la clave está en crear una **función auxiliar** que `isPangram(...)` utilice.

Esta función auxiliar te ayudará a determinar si un string contiene a otro string. Te recomendamos que llames a esta función `includes` y que llames a sus argumentos `haystack` (pajar) y `needle` (aguja). La idea es que queremos «encontrar la aguja en el pajar», una frase antigua en inglés.

Si crear varias funciones te parece abrumador, tal vez prefieras resolver el ejercicio primero sin la función auxiliar, usando un bucle anidado, y luego pensar cómo dividirlo en una función auxiliar.

¡Diviértete!
