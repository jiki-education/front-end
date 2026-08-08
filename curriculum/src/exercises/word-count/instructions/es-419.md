---
title: "Conteo de palabras"
description: "Cuenta cuántas veces aparece cada palabra en una oración."
en_md5: f9b46f800337d7fff2aab88b6e368e3d
---

Enseñas inglés como lengua extranjera a estudiantes de secundaria. Decidiste basar todo tu plan de estudios en series de televisión. Necesitas analizar qué palabras se usan y con qué frecuencia se repiten.

Tu tarea es contar cuántas veces aparece cada palabra en un subtítulo de una serie dramática. Los subtítulos solo usan caracteres ASCII.

Los personajes suelen hablar en inglés informal y usan contracciones como _they're_ o _it's_. Aunque estas contracciones provienen de dos palabras, la contracción se considera una sola palabra.

Las palabras pueden estar separadas por cualquier signo de puntuación (p. ej., «:», «!» o «?») o espacios. El único signo de puntuación que no separa palabras es el apóstrofo de las contracciones.

Los números se consideran palabras. Si los subtítulos dicen «It costs 100 dollars», entonces «100» será su propia palabra.

Las palabras no distinguen entre mayúsculas y minúsculas. Por ejemplo, la palabra «you» aparece tres veces en: «You come back, you hear me? DO YOU HEAR ME?»

Crea una función llamada `countWords` (contar palabras) que tome una oración como argumento y devuelva un diccionario con las palabras como claves y sus frecuencias como valores.
