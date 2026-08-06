---
title: "Horizonte urbano"
description: "Construye un horizonte urbano completo con edificios aleatorios."
en_md5: cb89a31566f55397d19e1375dbac44cc
---

En el ejercicio del rascacielos creaste un solo rascacielos de diferentes alturas. Esta vez lo llevamos más lejos, creando un horizonte de edificios de diferentes alturas y diferentes anchos.

Tienes una función `numBuildings()` (número de edificios), que te dice cuántos edificios necesitas crear para ese escenario. Luego tienes las funciones `randomWidth()` (ancho aleatorio) y `randomNumFloors()` (número aleatorio de pisos). Debes usarlas para determinar los anchos y el número de pisos de cada edificio en ese escenario. La primera vez que uses las funciones te darán los valores del primer edificio, y así sucesivamente.

Los edificios comienzan con una separación de una columna a la izquierda, y tienen una separación de una columna entre ellos.

Así que si tuvieras un escenario donde `numBuildings()` devuelve `2`, `randomWidth()` devuelve `5` y luego `7`, y `randomNumFloors()` devuelve `4` y luego `8`, obtendrías este diseño (donde `xxxxx` es el suelo de concreto)

```
       WWWWWWW
       WGGGGGW
       WGGGGGW
       WGGGGGW
 WWWWW WGGGGGW
 WGGGW WGGGGGW
 WGGGW WGGGGGW
 WGGGW WGGGGGW
 WGEGW WGGEGGW
xxxxxxxxxxxxxxxxxxxxxxx
```
