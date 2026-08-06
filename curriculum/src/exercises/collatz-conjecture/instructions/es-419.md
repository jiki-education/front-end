---
title: "Conjetura de Collatz"
description: "Explora un famoso enigma matemático con tu propia función."
en_md5: e4f7ab61c163cdb7c2eb2b6541a2cedc
---

Una noche, te topaste con un viejo cuaderno lleno de garabatos crípticos, como si alguien hubiera estado persiguiendo obsesivamente una idea. En una página, una sola pregunta destacaba: **¿Puede todo número encontrar su camino al 1?** Estaba relacionada con algo llamado la **Conjetura de Collatz**, un acertijo que ha desconcertado a los pensadores durante décadas.

Las reglas son engañosamente simples:

1. Elige un número.
2. Si es par, divídelo entre 2.
3. Si es impar, multiplícalo por 3 y luego súmale 1.
4. Repite con el resultado, continuando indefinidamente.

Por ejemplo, empezando con 12:

```
12 → 6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1
```

Contando a partir del segundo número (6), tomó 9 pasos alcanzar el 1.

Crea una función llamada `collatzSteps` (pasos de Collatz) que toma un argumento, un número. Devuelve **cuántos pasos** toma para que cualquier número llegue al 1, siguiendo las reglas de la conjetura de Collatz.
