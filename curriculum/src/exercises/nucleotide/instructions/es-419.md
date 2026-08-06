---
title: "Nucleótido"
description: "Cuenta cuántas veces aparece un nucleótido específico en una hebra de ADN."
en_md5: 7ab4068481d406fdfb6f598fabd042c1
---

El ADN es una cadena larga de otras sustancias químicas; las más importantes son los cuatro nucleótidos: adenina, citosina, guanina y timina. Una sola cadena de ADN puede contener miles de millones de estos cuatro nucleótidos, ¡y el orden en que aparecen es importante! Representamos una secuencia de ADN como una cadena de caracteres, por ejemplo `"ATTACG"`. 'A' para adenina, 'C' para citosina, 'G' para guanina y 'T' para timina.

Crea una función llamada `countNucleotide` (contar nucleótidos) que tome una hebra de ADN y un carácter de nucleótido, y devuelva la cantidad de veces que ese nucleótido aparece en la hebra.

Si el carácter de nucleótido no es válido (no es uno de A, C, G, T), devuelve `-1`.
Si la hebra contiene algún carácter inválido, también devuelve `-1`.

Por ejemplo:

- `countNucleotide("GATTACA", "A")` devuelve `3`
- `countNucleotide("GATTACA", "T")` devuelve `2`
- `countNucleotide("GATTACA", "X")` devuelve `-1`

Puedes usar `"...".includes(someString)` si lo necesitas.
