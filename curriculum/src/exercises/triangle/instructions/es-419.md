---
title: "Triángulo"
description: "Clasifica un triángulo como equilátero, isósceles o escaleno."
en_md5: 15574e7bfbdfaffbd935bf6bba258e63
---

Tu tarea es crear una función que verifique si un triángulo es equilátero, isósceles, escaleno o inválido.

### Triángulos

- Un triángulo _equilátero_ tiene los tres lados de igual longitud.
- Un triángulo _isósceles_ tiene dos lados de igual longitud.
- Un triángulo _escaleno_ tiene todos los lados de diferente longitud.

Para que un triángulo sea válido:

- Todos los lados deben ser mayores que 0
- Si sumas dos lados cualesquiera, el total debe ser mayor que el tercer lado.

### La función

La función debe llamarse `determineTriangleType` (determinar el tipo de triángulo). Debe recibir tres argumentos, que serán números para los tres lados del triángulo. Debe devolver uno de los siguientes valores: `"invalid"`, `"equilateral"`, `"isosceles"` o `"scalene"`.
